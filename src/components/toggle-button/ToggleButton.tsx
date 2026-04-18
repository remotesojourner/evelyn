import classNames from "classnames";
import React from "react";
import { connect } from "react-redux";

import * as elements from "common/elements";
import { State } from "data";

import style from "./ToggleButton.scss";

class ToggleButton extends React.Component<ToggleButtonProps & ReduxProps, {}> {
	onButtonClick = () => {
		if (this.props.disabled) return;

		this.updateCommentDisplay();
	};

	onMouseDown = (e: React.MouseEvent<any>) => {
		// Clear focus only on mouse interaction.
		e.preventDefault();
	};

	updateCommentDisplay() {
		const watchInfoSection = document.getElementById(elements.WATCH_INFO);
		if (watchInfoSection) {
			const description = watchInfoSection.firstElementChild as HTMLElement;
			if (description) {
				if (description.style.display === "none") {
					description.style.display = "block";
				} else {
					description.style.display = "none";
				}
			}
		}
	}

	componentWillReceiveProps(nextProps: ReduxProps) {
		const watchInfoSection = document.getElementById(elements.WATCH_INFO);
		if (watchInfoSection) {
			const description = watchInfoSection.firstElementChild as HTMLElement;
			if (description)
				if (nextProps.hideVideoDescription) {
					description.style.display = "none";
				} else {
					description.style.display = "block";
				}
		}
	}

	render() {
		const { disabled } = this.props;

		return (
			<button
				className={classNames(style.button, {
					[style.disabled]: disabled,
				})}
				onMouseDown={this.onMouseDown}
				onClick={this.onButtonClick}
				title={disabled ? "No comments found" : ""}
			>
				Toggle video description
			</button>
		);
	}
}

export interface ToggleButtonProps {
	disabled?: boolean;
}

const mapStateToProps = (state: State) => ({
	hideVideoDescription: state.options.hideVideoDescription,
});

const mapDispatchToProps = () => ({
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;
type ReduxProps = StateProps & DispatchProps;

const ConnectedToggleButton = connect<
	StateProps,
	DispatchProps,
	ToggleButtonProps
>(
	mapStateToProps,
	mapDispatchToProps
)(ToggleButton);
export { ConnectedToggleButton as ToggleButton };
