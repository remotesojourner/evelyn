
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

export const epic: Epic<Action, any, GlobalState> = (action$) =>
	action$.pipe(
		ofType(ActionTypes.REQUEST, ActionTypes.UPDATE, ActionTypes.SYNCED),
		mergeMap((action) => {
			switch (action.type) {
				case ActionTypes.REQUEST: {
					return from(chrome.storage.sync.get(initialState)).pipe(
						map((res) => update(res))
					);
				}

				case ActionTypes.UPDATE: {
					return from(chrome.storage.sync.set(action.payload)).pipe(
						map(() => synced())
					);
				}

				case ActionTypes.SYNCED: {
					return [];
				}
			}
		})
	);

export * from "./actions";
export * from "./model";
