import { from, throwError } from "rxjs";
import { map, mergeMap } from "rxjs/operators";

import { Comment, Me } from "data/reddit";
import { FetchRequest, FetchResponse } from "service-worker";

const buildQuery = (params: Record<string, string | number>) =>
	new URLSearchParams(params as any).toString();

const handleJsonError = (selector: (response: any) => any) => (res: any) => {
	const error = res.json.errors[0];
	if (error) return throwError(error[1]);
	else return [selector(res.json.data)];
};

const ajax = (opts: FetchRequest) =>
	from<Promise<FetchResponse | undefined>>(chrome.runtime.sendMessage(opts)).pipe(
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
		map((res) => (res.data.modhash ? (res.data as Me) : undefined))
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
	}).pipe(map((res) => res.data.children.map((c: any) => c.data)));
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
