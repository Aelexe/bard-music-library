import React from "react";

interface SelectOption {
	name: string;
	value: string;
}

interface Props {
	value?: string;
	placeholder?: string;
	prependText?: string;
	appendIcon?: string;
	options: SelectOption[];

	// Callbacks
	onChange?: (value: string) => void;
}

interface State {
	value: string;
	displayValue: string;

	// State
	options: SelectOption[];
	hasFocus: boolean;
	selectedIndex: number;
	error?: boolean;
	validationMessage?: string;
}

export default class InputSelect extends React.Component<Props, State> {
	private input: React.RefObject<HTMLInputElement>;

	constructor(props: Props) {
		super(props);
		this.state = {
			value: this.props.value || "",
			displayValue: this.getOptionName(this.props.value || ""),
			options: this.props.options,
			hasFocus: false,
			selectedIndex: 0,
		};

		this.input = React.createRef();
	}

	/**
	 * Gets the name of the option matching the provided value.
	 *
	 * @param value Value of the option to get the name of.
	 */
	getOptionName(value: string): string {
		// Find the matching option.
		const matchingOption = this.props.options.find((option) => {
			return option.value === value;
		});

		if (matchingOption === undefined) {
			// If the value was empty and no option matched, return an empty string.
			if (value === "") {
				return "";
			}

			// Throw an error if no matching option was found.
			throw new Error("Input Select does not contain an option matching the provided value.");
		}

		return matchingOption.name;
	}

	updateDisplayValue(displayValue: string): void {
		const options = this.props.options.filter((option: SelectOption) => {
			return option.name.startsWith(displayValue);
		});

		this.setState({ displayValue, options });
	}

	decrementSelectIndex(): void {
		let index = this.state.selectedIndex - 1;
		if (index < 0) {
			index = this.state.options.length - 1;
		}
		this.setState({ selectedIndex: index });
	}

	incrementSelectIndex(): void {
		let index = this.state.selectedIndex + 1;
		if (index >= this.state.options.length) {
			index = 0;
		}
		this.setState({ selectedIndex: index });
	}

	/**
	 * Selects the currently hovered option.
	 */
	select(): void;
	/**
	 * Selects the option matching the provided index.
	 * @param index Index of the option to select.
	 */
	select(index: number): void;
	select(index?: number): void {
		let selectedOption: SelectOption;
		if (index === undefined) {
			selectedOption = this.state.options[this.state.selectedIndex];
		} else {
			selectedOption = this.state.options[index];
		}

		this.setState({ value: selectedOption.value, displayValue: selectedOption.name });

		if (this.props.onChange !== undefined) {
			this.props.onChange(selectedOption.value);
		}
	}

	blur(): void {
		this.input.current?.blur();
	}

	setError(): void;
	setError(message: string): void;
	setError(message?: string): void {
		this.setState({ error: true, validationMessage: message });
	}

	removeError(): void {
		this.setState({ error: false, validationMessage: undefined });
	}

	renderOptions(): JSX.Element | undefined {
		if (this.state.hasFocus) {
			return (
				<ul className="options">
					{this.state.options.map((option: SelectOption, index: number) => {
						return (
							<li
								key={option.value}
								className={index === this.state.selectedIndex ? "selected" : ""}
								tabIndex={-1}
								onMouseOver={() => {
									this.setState({ selectedIndex: index });
								}}
								onClick={() => {
									this.select(index);
									this.setState({ hasFocus: false });
								}}
							>
								{option.name}
							</li>
						);
					})}
				</ul>
			);
		}
	}

	render(): JSX.Element {
		return (
			<div
				className={"input-select " + (this.state.error && "error")}
				onFocus={() => {
					this.setState({ hasFocus: true });
					this.removeError();
				}}
				onBlur={(e) => {
					// If the element receiving focus is a child element, don't lose focus.
					if (e.relatedTarget !== undefined && e.currentTarget.contains(e.relatedTarget as Node)) {
						return;
					}
					this.setState({ hasFocus: false });
				}}
			>
				{this.props.prependText && <div className="prepend">{this.props.prependText}</div>}
				<input
					ref={this.input}
					type="text"
					className={`${this.props.prependText && "prepend"} ${this.props.appendIcon && "append"}`}
					placeholder={this.props.placeholder}
					value={this.state.displayValue}
					onChange={(e) => {
						this.updateDisplayValue(e.target.value);
						if (this.props.onChange !== undefined) {
							this.props.onChange(e.target.value);
						}
					}}
					onKeyDown={(e) => {
						if (e.key === "ArrowDown") {
							this.incrementSelectIndex();
							e.preventDefault();
						} else if (e.key === "ArrowUp") {
							this.decrementSelectIndex();
							e.preventDefault();
						} else if (["Enter", "Tab"].indexOf(e.key) !== -1) {
							this.select();
							this.blur();
						} else if (e.key === "Escape") {
							this.blur();
						}
					}}
				></input>
				{this.props.appendIcon && (
					<div className="append">
						<i className={this.props.appendIcon} />
					</div>
				)}
				{this.renderOptions()}
			</div>
		);
	}
}
