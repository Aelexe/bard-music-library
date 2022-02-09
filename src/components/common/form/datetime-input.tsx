import React from "react";

interface Props {
	value?: string;
	min?: string;
	max?: string;
}

export default class DatetimeInput extends React.Component<Props, any> {
	constructor(props: Props) {
		super(props);
	}

	render(): JSX.Element {
		return <input type="datetime-local" min={this.props.min} max={this.props.max}></input>;
	}
}
