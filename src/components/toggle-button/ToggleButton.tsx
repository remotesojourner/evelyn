import classNames from "classnames";
import React from "react";
import { connect } from "react-redux";

import * as elements from "common/elements";
import { State } from "data";

import style from "./ToggleButton.scss";

class ToggleButton extends React.Component<ToggleButtonProps & ReduxProps, {}> {
	private userToggled = false;

	private getDescriptionElement = (): HTMLElement | null => {
		const watchInfoSection = document.getElementById(elements.WATCH_INFO);
		const description = watchInfoSection?.firstElementChild as HTMLElement | null;
		if (!description || description.id === "tube-mount") return null;
		return description;
	};

	private syncDescriptionVisibility = () => {
		if (this.userToggled) return;

		const description = this.getDescriptionElement();
		if (!description) return;

		if (this.props.hideVideoDescription && !this.props.disabled) {
			description.style.display = "none";
		} else {
			description.style.display = "";
		}
	};

	onButtonClick = () => {
		const description = this.getDescriptionElement();
		if (this.props.disabled && description?.style.display !== "none") return;

		this.userToggled = true;
		this.updateCommentDisplay();
	};

	onMouseDown = (e: React.MouseEvent<any>) => {
		// Clear focus only on mouse interaction.
		e.preventDefault();
	};

	updateCommentDisplay() {
		const description = this.getDescriptionElement();
		if (description) {
			if (description.style.display === "none") {
				description.style.display = "";
			} else {
				description.style.display = "none";
			}
		}
	}

	componentDidMount() {
		this.syncDescriptionVisibility();
	}

	componentDidUpdate(prevProps: ToggleButtonProps & ReduxProps) {
		if (prevProps.hideVideoDescription !== this.props.hideVideoDescription) {
			this.userToggled = false;
		}
		this.syncDescriptionVisibility();
	}

	componentWillUnmount() {
		if (!this.userToggled) {
			const description = this.getDescriptionElement();
			if (description && description.style.display === "none") {
				description.style.display = "";
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
