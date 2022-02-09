import React from "react";

interface Props {
	value?: boolean;

	// Callbacks
	onChange?: (value: boolean) => void;
}

interface State {
	value: boolean;
}

export default class Checkbox extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = { value: this.props.value || false };
	}

	loadStateFromProps(prevProps?: Props): void {
		if (this.state === undefined) {
			this.state = { value: this.props.value || false };
		} else {
			if (prevProps?.value !== this.props.value) {
				this.setState({ value: this.props.value || false });
			}
		}
	}

	componentDidUpdate(prevProps: Props): void {
		this.loadStateFromProps(prevProps);
	}

	render(): JSX.Element {
		return (
			<div className="checkbox bounce">
				<input
					type="checkbox"
					checked={this.state.value}
					onChange={(e) => {
						this.setState({ value: e.target.checked });

						if (this.props.onChange) {
							this.props.onChange(e.target.checked);
						}
					}}
				/>
				<svg viewBox="0 0 21 21">
					<polyline points="5 10.75 8.5 14.25 16 6"></polyline>
				</svg>
			</div>
		);
	}
}
