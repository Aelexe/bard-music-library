import React from "react";
import classnames from "classnames";

interface Props {
	name?: string;
	value?: string;
	placeholder?: string;
	height?: string;
	resize?: boolean;
	hasValidation?: boolean;

	// Callbacks
	onChange?: (value: string) => void;
	onClick?: () => void;
	onBlur?: (value: string) => void;
}

interface TextAreaState {
	value: string;

	// State
	error?: boolean;
	validationMessage?: string;
}

export default class TextArea extends React.Component<Props, TextAreaState> {
	constructor(props: Props) {
		super(props);
		this.state = { value: this.props.value || "" };
	}

	loadStateFromProps(prevProps?: Props): void {
		if (this.state === undefined) {
			this.state = { value: this.props.value || "" };
		} else {
			if (prevProps?.value !== this.props.value) {
				this.setState({ value: this.props.value || "" });
			}
		}
	}

	componentDidUpdate(prevProps: Props): void {
		this.loadStateFromProps(prevProps);
	}

	setError(): void;
	setError(message: string): void;
	setError(message?: string): void {
		this.setState({ error: true, validationMessage: message });
	}

	removeError(): void {
		this.setState({ error: false, validationMessage: undefined });
	}

	renderValidation(): JSX.Element | undefined {
		if (this.props.hasValidation) {
			return <div className="validation">{this.state.validationMessage}</div>;
		}
	}

	render(): JSX.Element {
		const style: React.CSSProperties = {};
		if (this.props.height) {
			style.height = this.props.height;
		}

		return (
			<div className={classnames("textarea", { error: this.state.error })}>
				<div className="control">
					<textarea
						name={this.props.name}
						className={classnames({ resize: this.props.resize })}
						style={style}
						placeholder={this.props.placeholder}
						value={this.state.value}
						onChange={(e) => {
							this.setState({ value: e.target.value });
							if (this.props.onChange !== undefined) {
								this.props.onChange(e.target.value);
							}
						}}
						onClick={() => {
							if (this.props.onClick !== undefined) {
								this.props.onClick();
							}
						}}
						onFocus={this.removeError.bind(this)}
					></textarea>
				</div>
				{this.renderValidation()}
			</div>
		);
	}
}
