import React from "react";

interface Props {
	name?: string;
	value?: string;
	placeholder?: string;
	hasValidation?: boolean;

	// Callbacks
	onChange?: (value: string) => void;
	onClick?: () => void;
	onBlur?: (value: string) => void;
}

interface State {
	value: string;

	// State
	error?: boolean;
	validationMessage?: string;
}

export default class PasswordInput extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { value: this.props.value || "" };
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
		return (
			<div className={"input " + (this.state.error && "error")}>
				<div className="control">
					<input
						type="password"
						name={this.props.name}
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
						onBlur={() => {
							if (this.props.onBlur !== undefined) {
								this.props.onBlur(this.state.value);
							}
						}}
					></input>
				</div>
				{this.renderValidation()}
			</div>
		);
	}
}
