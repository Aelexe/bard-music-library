import React from "react";

import classnames from "classnames";

interface ButtonProps {
	name?: string;
	icon?: string;
	spinner?: boolean;
	disable?: boolean;
	color?: "red" | "green" | "blue" | "grey";
	type?: "button" | "reset" | "submit";

	// Callbacks
	onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export default class Button extends React.Component<ButtonProps, any> {
	constructor(props: ButtonProps) {
		super(props);
	}

	onClick(e: React.MouseEvent<HTMLElement, MouseEvent>): void {
		if (this.props.disable) {
			e.preventDefault();
			return;
		}

		if (this.props.onClick) {
			this.props.onClick(e);
		}
	}

	render(): JSX.Element {
		const type = this.props.type || "button";
		let content;
		let spinner;

		if (this.props.name !== undefined) {
			content = this.props.name;
		} else if (this.props.icon !== undefined) {
			content = <i className={this.props.icon} />;
		} else if (this.props.children !== undefined) {
			content = this.props.children;
		}

		if (this.props.spinner) {
			spinner = (
				<div className="spinner">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
			);
		}
		return (
			<button
				className={classnames([
					this.props.color,
					{ "hide-text": this.props.spinner, "disable-interact": this.props.disable },
				])}
				type={type}
				onClick={this.onClick.bind(this)}
			>
				{content}
				{spinner}
			</button>
		);
	}
}
