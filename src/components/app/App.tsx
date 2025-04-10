import { push } from "connected-react-router";
import React from "react";
import { connect } from "react-redux";
import { Route } from "react-router";
import { Action, Dispatch, bindActionCreators } from "redux";

import { returnOf } from "common/util";
import { State } from "data";
import { request as requestOptions } from "data/options";
import { requestMe } from "data/reddit";

import * as elements from "common/elements";
import { VideoListener } from "components/video-listener";
import { Comments } from "pages/comments";
import { Options } from "pages/options";
import style from "./App.scss";


class App extends React.Component<AppProps & ReduxProps, {}> {

	componentWillMount() {
		this.props.requestMe();
		this.props.requestOptions();
		if (window.OPTIONS_PAGE) this.props.push("/options");
	}

	render() {
		return (
			<main className={style.container} >
				{!window.OPTIONS_PAGE && (
					<>
						<VideoListener />
					</>
				)}

				<div style={{ width: "100%", display: "block", }}>
					<Route exact path="/options" component={Options} />
					<Route path={/\/(?!options)/ as any} component={Comments} />
				</div>
			</main>
		);
	}
}

export interface AppProps { }

const mapStateToProps = (state: State) => ({
	path: state.router.location.pathname,
	posts: state.options.hideZeroCommentPosts
		? state.reddit.posts.filter((post) => post.num_comments > 0)
		: state.reddit.posts,
	postsLoading: state.reddit.postsLoading,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) =>
	bindActionCreators(
		{
			push,
			requestMe,
			requestOptions,
		},
		dispatch
	);

type ReduxProps = typeof StateProps & typeof DispatchProps;
const StateProps = returnOf(mapStateToProps);
const DispatchProps = returnOf(mapDispatchToProps);

const ConnectedApp = connect<typeof StateProps, typeof DispatchProps, AppProps>(
	mapStateToProps,
	mapDispatchToProps
)(App);
export { ConnectedApp as App };
