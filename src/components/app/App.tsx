import React from "react";
import { connect } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { Action, Dispatch, bindActionCreators } from "redux";

import { State } from "data";
import { request as requestOptions } from "data/options";
import { requestMe } from "data/reddit";

import { VideoListener } from "components/video-listener";
import { Comments } from "pages/comments";
import { Options } from "pages/options";
import style from "./App.scss";


class App extends React.Component<AppProps & ReduxProps, {}> {

	componentDidMount() {
		this.props.requestMe();
		this.props.requestOptions();
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
					<Routes>
						<Route path="/options" element={<Options />} />
						<Route path="/comments" element={<Comments />} />
					</Routes>
				</div>
			</main>
		);
	}
}

export interface AppProps { }

const mapStateToProps = (state: State) => ({
	posts: state.options.hideZeroCommentPosts
		? state.reddit.posts.filter((post) => post.num_comments > 0)
		: state.reddit.posts,
	postsLoading: state.reddit.postsLoading,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) =>
	bindActionCreators(
		{
			requestMe,
			requestOptions,
		},
		dispatch
	);

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;
type ReduxProps = StateProps & DispatchProps;

const ConnectedApp = connect<StateProps, DispatchProps, AppProps>(
	mapStateToProps,
	mapDispatchToProps
)(App);
export { ConnectedApp as App };
