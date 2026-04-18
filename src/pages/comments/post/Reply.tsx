import React from "react";
import { lastValueFrom } from "rxjs";
import { withTranslation, WithTranslation } from "react-i18next";

import { connect } from "react-redux";
import { Action, Dispatch, bindActionCreators } from "redux";

import { comment } from "common/reddit-api";
import { receiveMoreComments } from "data/reddit";

import { ActionList } from "../ActionList";
import style from "./Reply.scss";

class ReplyInner extends React.Component<ReplyProps & ReduxProps, ReplyState> {
	state = {
		error: "",
		loading: false,
		text: ""
	};

	onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		this.setState({ text: e.target.value });
	};

	onClickSave = async () => {
		const { modhash, onClose, linkId, parentId, t } = this.props;
		let error = "";
		this.setState({ error, loading: true });

		try {
			const data = await lastValueFrom(comment(
				modhash,
				parentId,
				this.state.text
			));
			this.props.receiveMoreComments({
				comments: [data],
				id: "",
				linkId,
				parentId,
				prepend: true
			});
		} catch (err) {
			console.log(err);
			error = typeof err === "string" ? err : t!("unknownError");
		}

		this.setState({ error, loading: false });
		if (!error) onClose();
	};

	render() {
		const t = this.props.t!;

		return (
			<div className={style.reply}>
				<textarea onChange={this.onChange} value={this.state.text} />

				<ActionList>
					<button onClick={this.onClickSave}>{t("save")}</button>
					<button onClick={this.props.onClose}>{t("cancel")}</button>
					{this.state.error ? (
						<p className={style.error}>{this.state.error}</p>
					) : null}
					{this.state.loading ? <p>{t("submitting")}</p> : null}
				</ActionList>
			</div>
		);
	}
}

export interface ReplyProps extends WithTranslation {
	linkId: string;
	modhash: string;
	onClose: () => void;
	parentId: string;
}

interface ReplyState {
	error: string;
	loading: boolean;
	text: string;
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) =>
	bindActionCreators(
		{
			receiveMoreComments
		},
		dispatch
	);

type DispatchProps = ReturnType<typeof mapDispatchToProps>;
type ReduxProps = DispatchProps;

const ConnectedReply = connect<{}, DispatchProps, ReplyProps>(
	null,
	mapDispatchToProps
)(ReplyInner);
export const Reply = withTranslation("reply")(ConnectedReply as any);
