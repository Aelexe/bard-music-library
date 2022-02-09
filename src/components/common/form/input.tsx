import React from "react";

interface Props {
	name?: string;
	value?: string;
	placeholder?: string;
	prependIcon?: string;
	prependText?: string;
	appendIcon?: string;
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

export default class Input extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.loadStateFromProps();
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
		return (
			<div className={"input " + (this.state.error && "error")}>
				<div className="control">
					{this.props.prependIcon && (
						<div className="prepend">
							<i className={this.props.prependIcon} />
						</div>
					)}
					{this.props.prependText && <div className="prepend">{this.props.prependText}</div>}
					<input
						type="text"
						name={this.props.name}
						className={`${this.props.prependText && "prepend"} ${this.props.appendIcon && "append"}`}
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
					{this.props.appendIcon && (
						<div className="append">
							<i className={this.props.appendIcon} />
						</div>
					)}
				</div>
				{this.renderValidation()}
			</div>
		);
	}
}
