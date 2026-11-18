import { from, throwError } from "rxjs";
import { map, mergeMap } from "rxjs/operators";

import { Comment, Me } from "data/reddit";
import { FetchRequest, FetchResponse, WorkerRequest } from "service-worker";

const buildQuery = (params: Record<string, string | number>) =>
	new URLSearchParams(params as any).toString();

export const sendRuntimeMessage = (
	msg: WorkerRequest
): Promise<FetchResponse | undefined> => {
	const runtimeApi =
		(globalThis as any).browser?.runtime || chrome.runtime;
	return new Promise((resolve, reject) => {
		let settled = false;
		const finish = (res?: FetchResponse) => {
			if (!settled) {
				settled = true;
				resolve(res);
			}
		};
		const fail = (err: unknown) => {
			if (!settled) {
				settled = true;
				reject(err);
			}
		};

		try {
			const maybePromise = runtimeApi.sendMessage(
				msg,
				(res: FetchResponse | undefined) => {
					if (chrome.runtime.lastError) {
						fail(chrome.runtime.lastError.message);
					} else {
						finish(res);
					}
				}
			);
			if (maybePromise && typeof maybePromise.then === "function") {
				maybePromise.then(finish, fail);
			}
		} catch {
			try {
				runtimeApi.sendMessage(msg).then(finish, fail);
			} catch (err) {
				fail(err);
			}
		}
	});
};

const handleJsonError = (selector: (response: any) => any) => (res: any) => {
	const error = res.json.errors[0];
	if (error) return throwError(error[1]);
	else return [selector(res.json.data)];
};

const ajax = (opts: FetchRequest) =>
	from(sendRuntimeMessage(opts)).pipe(
		mergeMap((res) => {
			if (!res) return throwError('No response from service worker');
			return res.error ? throwError(res.error) : [res.data];
		})
	);

export function comment(modhash: string, parentId: string, text: string) {
	const query = {
		api_type: "json",
		text,
		thing_id: parentId,
		uh: modhash,
	};
	return ajax({
		url: `/api/comment.json?${buildQuery(query)}`,
		method: "POST",
	}).pipe<Comment>(mergeMap(handleJsonError((res) => res.things[0].data)));
}

export function getMe() {
	return ajax({ url: `/api/me.json`, method: "GET" }).pipe(
		map((res) => {
			const data = res?.data ?? res;
			return data?.name
				? ({ ...data, modhash: data.modhash || "" } as Me)
				: undefined;
		})
	);
}

export function getMoreChildren(
	linkId: string,
	id: string,
	children: string[],
	sort: string
) {
	const query = {
		api_type: "json",
		children: children.join(","),
		id,
		link_id: linkId,
		sort,
	};
	return ajax({
		url: `/api/morechildren.json?${buildQuery(query)}`,
		method: "GET",
	}).pipe<Comment[]>(
		mergeMap(
			handleJsonError((res) =>
				res ? res.things.map((c: any) => c.data) : []
			)
		)
	);
}

export function getPost(postId: string, sort: string) {
	return ajax({
		url: `/comments/${postId}.json?sort=${sort}`,
		method: "GET",
	}).pipe(map((res) => res));
}

export function save(modhash: string, id: string, unsave?: boolean) {
	const query = { id, uh: modhash };
	return ajax({
		url: `/api/${unsave ? "unsave" : "save"}?${buildQuery(query)}`,
		method: "POST",
	});
}

export function search(query: QuerySearch) {
	return ajax({
		url: `/search.json?${buildQuery(query as any)}`,
		method: "GET",
	}).pipe(
		map((res) =>
			res?.data?.children ? res.data.children.map((c: any) => c.data) : []
		)
	);
}

export function vote(modhash: string, id: string, dir: number) {
	const query = {
		dir,
		id,
		rank: 2,
		uh: modhash,
	};
	return ajax({ url: `/api/vote.json?${buildQuery(query)}`, method: "POST" });
}

interface QuerySearch {
	q: string;
	sort?: string;
	type?: string;
}
