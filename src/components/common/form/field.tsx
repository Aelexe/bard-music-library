import React from "react";

interface Props {
	name: string;
	style?: "column" | "row";
	cssClasses?: string;
}

export default class Field extends React.Component<Props, any> {
	constructor(props: Props) {
		super(props);
	}

	render(): JSX.Element {
		const style = this.props.style || "column";
		const classes = this.props.cssClasses || "";

		return (
			<div className={`field ${style} ${classes}`}>
				<label>{this.props.name}</label>
				{this.props.children}
			</div>
		);
	}
}
