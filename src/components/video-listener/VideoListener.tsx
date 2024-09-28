import React from "react";
import { connect } from "react-redux";
import { Action, Dispatch, bindActionCreators } from "redux";

import * as elements from "common/elements";
import { returnOf } from "common/util";
import { State } from "data";
import { update } from "data/video";

const CHECK_INTERVAL = 1000;

class VideoListener extends React.Component<
	VideoListenerProps & ReduxProps,
	{}
> {
	private intervalId: any;

	checkLocation = () => {
		const search = new URLSearchParams(location.search);
		const id = search.get("v");
		const description =
			document.querySelector(elements.VIDEO_DESCRIPTION)?.textContent ||
			"";
		if (this.props.id !== id || this.props.description !== description) {
			this.props.update({
				description,
				id,
			});
		}
	};

	componentDidMount() {
		this.intervalId = setInterval(this.checkLocation, CHECK_INTERVAL);
		// Trigger initial video state hydration.
		this.checkLocation();
	}

	componentWillUnmount() {
		clearInterval(this.intervalId);
	}

	render() {
		return null;
	}
}

export interface VideoListenerProps {}

const mapDispatchToProps = (dispatch: Dispatch<Action>) =>
	bindActionCreators(
		{
			update,
		},
		dispatch
	);

const mapStateToProps = (state: State) => ({
	description: state.video.description,
	id: state.video.id,
});

type ReduxProps = typeof StateProps & typeof DispatchProps;
const StateProps = returnOf(mapStateToProps);
const DispatchProps = returnOf(mapDispatchToProps);

const ConnectedVideoListener = connect<
	typeof StateProps,
	typeof DispatchProps,
	VideoListenerProps
>(
	mapStateToProps,
	mapDispatchToProps
)(VideoListener);
export { ConnectedVideoListener as VideoListener };
