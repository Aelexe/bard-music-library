import React from "react";

interface Props {
	value?: string;
	min?: string;
	max?: string;
}

export default class DateInput extends React.Component<Props, any> {
	constructor(props: Props) {
		super(props);
	}

	render(): JSX.Element {
		return <input type="date" min={this.props.min} max={this.props.max}></input>;
	}
}
