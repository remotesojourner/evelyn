
import { Epic, ofType } from "redux-observable";
import { from } from "rxjs";
import { map, mergeMap } from "rxjs/operators";

import { State as GlobalState } from "data";

import { Action, ActionTypes, synced, update } from "./actions";
import { State } from "./model";

const initialState: State = {
	commentSort: "best",
	hideVideoDescription: true,
	hideZeroCommentPosts: false,
	postSort: "top",
};

export const reducer = (state = initialState, action: Action): State => {
	switch (action.type) {
		case ActionTypes.UPDATE: {
			return Object.assign({}, state, action.payload);
		}

		default:
			return state;
	}
};

const callStorageSync = <T>(
	method: "get" | "set",
	arg: Partial<State>,
	fallback: T
): Promise<T> =>
	new Promise((resolve) => {
		const sync = ((globalThis as any).browser?.storage || chrome.storage)
			.sync;
		let settled = false;
		const finish = (res?: T) => {
			if (!settled) {
				settled = true;
				resolve(res === undefined ? fallback : res);
			}
		};
		try {
			const maybePromise = sync[method](arg, finish);
			if (maybePromise && typeof maybePromise.then === "function") {
				maybePromise.then(finish, () => finish(fallback));
			}
		} catch {
			sync[method](arg).then(finish, () => finish(fallback));
		}
	});

export const epic: Epic<Action, any, GlobalState> = (action$) =>
	action$.pipe(
		ofType(ActionTypes.REQUEST, ActionTypes.UPDATE, ActionTypes.SYNCED),
		mergeMap((action) => {
			switch (action.type) {
				case ActionTypes.REQUEST: {
					return from(
						callStorageSync<Partial<State>>(
							"get",
							initialState,
							initialState
						)
					).pipe(map((res) => update(res)));
				}

				case ActionTypes.UPDATE: {
					return from(
						callStorageSync<void>("set", action.payload, undefined)
					).pipe(map(() => synced()));
				}

				case ActionTypes.SYNCED: {
					return [];
				}
			}
		})
	);

export * from "./actions";
export * from "./model";
