import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Action, Dispatch, bindActionCreators } from "redux";

import {
	REDDIT_ORIGIN,
	hasOriginPermission,
	requestOriginPermission,
} from "common/permissions";
import { State } from "data";
import { update } from "data/options";
import { requestMe } from "data/reddit";
import style from "./Options.scss";

interface OptionsState {
	hasPermission: boolean;
	permissionError: string;
}

class Options extends React.Component<OptionsProps, OptionsState> {
	state: OptionsState = { hasPermission: true, permissionError: "" };

	componentDidMount() {
		hasOriginPermission(REDDIT_ORIGIN).then((granted) => {
			if (typeof granted === "boolean") {
				this.setState({ hasPermission: granted });
			}
		});
	}

	onGrantPermission = () => {
		requestOriginPermission(REDDIT_ORIGIN).then(
			(granted) => {
				if (granted) {
					this.setState({ hasPermission: true, permissionError: "" });
					this.props.requestMe();
				} else {
					this.setState({
						hasPermission: false,
						permissionError:
							"Permission was not granted. Try removing and re-adding the unpacked extension in chrome://extensions (or enabling oauth.reddit.com in about:addons on Firefox).",
					});
				}
			},
			(err: unknown) => this.setState({ permissionError: String(err) })
		);
	};

	onChange = (
		key: string,
		e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
	) => {
		this.props.update({
			[key]: "checked" in e.target ? e.target.checked : e.target.value
		});
	};

	render() {
		const t = this.props.t!;
		const { me, meLoading, options } = this.props;
		const { hasPermission, permissionError } = this.state;
		const sortTypes = {
			best: t("post:sort.best"),
			top: t("post:sort.top"),
			new: t("post:sort.new"),
			controversial: t("post:sort.controversial"),
			old: t("post:sort.old"),
			random: t("post:sort.random")
		};

		return (
			<section className={style.container}>
				{!hasPermission && (
					<p>
						<b>Reddit access permission required:</b>
						<button
							type="button"
							onClick={this.onGrantPermission}
							style={{
								marginTop: "6px",
								padding: "6px 12px",
								width: "fit-content",
								cursor: "pointer",
							}}
						>
							Grant access to oauth.reddit.com
						</button>
						{permissionError && (
							<span style={{ color: "#c00", marginTop: "4px" }}>
								{permissionError}
							</span>
						)}
					</p>
				)}
				{hasPermission && me && (
					<p>
						<b>Logged into Reddit as:</b> {me.name}
					</p>
				)}
				{hasPermission && !me && !meLoading && (
					<p>
						<b>Not logged into Reddit.</b>{" "}
						<a
							href="https://www.reddit.com/login"
							target="_blank"
							rel="noopener noreferrer"
						>
							Log in to Reddit
						</a>{" "}
						to load comments.
					</p>
				)}
				<p>
					<b>{t("commentSort")}:</b>{" "}
					<select
						title={t("commentSort")}
						onChange={this.onChange.bind(null, "commentSort")}
						value={options.commentSort}
					>
						{Object.entries(sortTypes).map(([type, name]) => (
							<option key={type} value={type}>
								{name}
							</option>
						))}
					</select>
				</p>
				<p>
					<b>{t("hideVideoDescription")}:</b>{" "}
					<input
						title={t("hideVideoDescription")}
						type="checkbox"
						onChange={this.onChange.bind(
							null,
							"hideVideoDescription"
						)}
						checked={options.hideVideoDescription}
					/>
				</p>
				<p>
					<b>{t("hideZeroCommentPosts")}:</b>{" "}
					<input
						title={t("hideZeroCommentPosts")}
						type="checkbox"
						onChange={this.onChange.bind(
							null,
							"hideZeroCommentPosts"
						)}
						checked={options.hideZeroCommentPosts}
					/>
				</p>
				<p>
					<b>{t("postSort")}:</b>{" "}
					<select
						title={t("postSort")}
						onChange={this.onChange.bind(null, "postSort")}
						value={options.postSort}
					>
						{Object.entries(sortTypes).map(([type, name]) => (
							<option key={type} value={type}>
								{name}
							</option>
						))}
					</select>
				</p>
			</section>
		);
	}
}

export type OptionsProps = WithTranslation & ReduxProps;

const mapStateToProps = (state: State) => ({
	me: state.reddit.me,
	meLoading: state.reddit.meLoading,
	options: state.options
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) =>
	bindActionCreators(
		{
			requestMe,
			update
		},
		dispatch
	);

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;
type ReduxProps = StateProps & DispatchProps;

const ConnectedOptions = connect<StateProps, DispatchProps, {}>(
	mapStateToProps,
	mapDispatchToProps
)(Options);
const TranslatedOptions = withTranslation(["options", "post"])(ConnectedOptions as any);
export { TranslatedOptions as Options };
