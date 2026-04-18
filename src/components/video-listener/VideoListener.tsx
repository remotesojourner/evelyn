import React from "react";
import { connect } from "react-redux";
import { Action, Dispatch, bindActionCreators } from "redux";

import { State } from "data";
import { update } from "data/video";

const CHECK_INTERVAL = 1000;

class VideoListener extends React.Component<
	VideoListenerProps & ReduxProps,
	{}
> {
	private intervalId: any;

	checkLocation = () => {
		let id: string | null = null;
		if (location.hostname.endsWith('dropout.tv')) {
			const videosIndex = location.pathname.indexOf('/videos/');
			if (videosIndex >= 0) {
				id = location.pathname.slice(videosIndex); // e.g. "/videos/family"
			}
		}
		if (this.props.id !== id) {
			this.props.update({ id });
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

export interface VideoListenerProps { }

const mapDispatchToProps = (dispatch: Dispatch<Action>) =>
	bindActionCreators(
		{
			update,
		},
		dispatch
	);

const mapStateToProps = (state: State) => ({
	id: state.video.id,
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;
type ReduxProps = StateProps & DispatchProps;

const ConnectedVideoListener = connect<
	StateProps,
	DispatchProps,
	VideoListenerProps
>(
	mapStateToProps,
	mapDispatchToProps
)(VideoListener);
export { ConnectedVideoListener as VideoListener };
