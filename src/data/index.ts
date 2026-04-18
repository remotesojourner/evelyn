import { combineEpics, Epic } from "redux-observable";

import * as options from "./options";
import * as reddit from "./reddit";
import * as video from "./video";

export interface State {
	reddit: reddit.State;
	options: options.State;
	video: video.State;
}

export interface TypedAction<T extends string> {
	readonly type: T;
	payload?: {};
}

export const rootEpic: Epic<any, any, State> = combineEpics(
	reddit.epic as any,
	options.epic as any,
	video.epic as any
);

export default {
	reddit: reddit.reducer,
	options: options.reducer,
	video: video.reducer
};
