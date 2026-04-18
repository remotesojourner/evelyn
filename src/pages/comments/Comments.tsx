import React from "react";
import { connect } from "react-redux";
import { Action, Dispatch, bindActionCreators } from "redux";

import { State } from "data";
import {
	Post as RedditPost,
	requestComments,
	requestMoreComments,
	requestPosts,
} from "data/reddit";

import { Loading } from "components/loading";
import { ToggleButton } from "components/toggle-button";
import style from "./Comments.scss";
import { Post } from "./post";
import { PostList } from "./post-list";

class Comments extends React.Component<
	CommentsProps & ReduxProps,
	CommentsState
> {
	state: CommentsState = { sort: {} };

	loadMore = (
		parentId: string,
		linkId: string,
		id: string,
		children: string[],
		sort: string
	) => {
		this.props.requestMoreComments({
			parentId,
			linkId,
			id,
			children,
			sort,
		});
	};

	onPostClick = (post: RedditPost) => {
		this.setState({ post });
	};

	onSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		this.props.requestComments(this.state.post!.name, e.target.value);
		this.setState({
			sort: {
				...this.state.sort,
				[this.state.post!.name]: e.target.value,
			},
		});
	};

	selectFirstPost = (posts: RedditPost[]) =>
		posts.length > 0 && this.setState({ post: posts[0] });

	componentDidUpdate(prevProps: ReduxProps, prevState: CommentsState) {
		// Select first post if it's the first load
		if (
			!this.props.posts.every(
				(nextPost) =>
					!!prevProps.posts.find(
						(prevPost) => prevPost.id === nextPost.id
					)
			)
		) {
			this.selectFirstPost(this.props.posts);
		}

		// Request comments if post was changed
		if (
			this.state.post &&
			!this.props.comments[this.state.post.name] &&
			(!prevState.post || this.state.post.name !== prevState.post.name)
		) {
			this.props.requestComments(
				this.state.post!.name,
				this.state.sort[this.state.post!.name] || this.props.commentSort
			);
		}
	}

	render() {
		const { commentsLoading, postsError, postsLoading } = this.props;
		const { post } = this.state;

		if (postsError === 'AUTH_REQUIRED') {
			return (
				<section className={style.container}>
					<p style={{ padding: '1em' }}>
						Could not load Reddit comments. Please{' '}
						<a href="https://www.reddit.com/login" target="_blank">log in to Reddit</a>{' '}
						and reload the page.
					</p>
				</section>
			);
		}

		return (
			<section className={style.container}>
				<ToggleButton
					disabled={
						!this.props.postsLoading &&
						this.props.posts.length === 0
					}
				/>
				<PostList
					activePostId={post ? post.name : ""}
					onPostClick={this.onPostClick}
					posts={this.props.posts}
				/>

				{postsLoading ? (
					<Loading />
				) : post ? (
					<Post
						comments={this.props.comments[post.name] || []}
						commentsLoading={commentsLoading}
						loadMore={this.loadMore}
						modhash={this.props.modhash}
						moreCommentsLoading={this.props.moreCommentsLoading}
						onSortChange={this.onSortChange}
						post={post}
						sort={this.state.sort[post.name] || "best"}
					/>
				) : null}
			</section>
		);
	}
}

export interface CommentsProps { }

interface CommentsState {
	post?: RedditPost;
	sort: { [id: string]: string };
}

const mapStateToProps = (state: State) => ({
	comments: state.reddit.comments,
	commentSort: state.options.commentSort,
	commentsLoading: state.reddit.commentsLoading,
	modhash: state.reddit.me ? state.reddit.me.modhash : "",
	moreCommentsLoading: state.reddit.moreCommentsLoading,
	posts: state.options.hideZeroCommentPosts
		? state.reddit.posts.filter((post) => post.num_comments > 0)
		: state.reddit.posts,
	postsError: state.reddit.postsError,
	postsLoading: state.reddit.postsLoading,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) =>
	bindActionCreators(
		{
			requestComments,
			requestMoreComments,
			requestPosts,
		},
		dispatch
	);

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;
type ReduxProps = StateProps & DispatchProps;

const ConnectedComments = connect<
	StateProps,
	DispatchProps,
	CommentsProps
>(
	mapStateToProps,
	mapDispatchToProps
)(Comments);
export { ConnectedComments as Comments };
