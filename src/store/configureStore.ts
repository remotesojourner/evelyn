import reducers, { State, rootEpic } from "data";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { createEpicMiddleware } from "redux-observable";

export default (initialState?: State) => {
	const epicMiddleware = createEpicMiddleware<any, any, State>();

	const optional: any[] = [];
	if (process.env.NODE_ENV === "development") {
		const { logger } = require("redux-logger");
		optional.push(logger);
	}

	const enhancers = compose(
		applyMiddleware(...optional, epicMiddleware)
	);

	const store = initialState
		? createStore<State, any, any, any>(
			combineReducers(reducers),
			initialState,
			enhancers
		)
		: createStore<State, any, any, any>(
			combineReducers(reducers),
			enhancers
		);

	epicMiddleware.run(rootEpic);

	return store;
};
