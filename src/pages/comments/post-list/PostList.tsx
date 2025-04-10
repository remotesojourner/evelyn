import classnames from "classnames";
import React from "react";

import { Post } from "data/reddit";

import { PostItem } from "./PostItem";
import style from "./PostList.scss";

export const PostList = ({
	activePostId,
	onPostClick,
	posts
}: PostListProps) => {
	return (
		<div className={style.list}>
			{posts
				.map(post => (
					<PostItem
						key={post.name}
						className={classnames(style.item, {
							[style.active]: post.name === activePostId
						})}
						onClick={onPostClick.bind(null, post)}
						post={post}
						title={""}
					/>
				))}
		</div>
	);
};

export interface PostListProps {
	activePostId: string;
	onPostClick: (post: Post) => void;
	posts: Post[];
}
