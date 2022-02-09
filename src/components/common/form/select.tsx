import React from "react";

interface SelectOption {
	id: string;
	name: string;
}

interface SelectProps {
	value?: string;
	placeholder?: string;
	options: SelectOption[];

	// Callbacks
	onChange?: (value: string) => void;
}

interface SelectState {
	displayPlaceholder: boolean;
}

export default class Select extends React.Component<SelectProps, SelectState> {
	private select: React.RefObject<HTMLSelectElement>;

	constructor(props: SelectProps) {
		super(props);

		this.state = { displayPlaceholder: true };
		this.select = React.createRef();
	}

	componentDidUpdate(previousProps: SelectProps): void {
		// If the options list changed fire a change event for the current value.
		if (this.props.options.length !== previousProps.options.length) {
			if (this.props.onChange) {
				this.props.onChange(this.select.current!.value);
			}
		}
	}

	renderOptions(): JSX.Element[] {
		const options: JSX.Element[] = [];

		if (this.state.displayPlaceholder && this.props.placeholder !== undefined) {
			options.push(
				<option key="" value="">
					{this.props.placeholder}
				</option>
			);
		}

		this.props.options.forEach((option) => {
			options.push(
				<option key={option.id} value={option.id}>
					{option.name}
				</option>
			);
		});

		return options;
	}

	render(): JSX.Element {
		return (
			<select
				ref={this.select}
				placeholder={this.props.placeholder}
				onClick={() => {
					// Remove the placeholder on first click.
					if (this.state.displayPlaceholder) {
						this.setState({ displayPlaceholder: false });

						// If there was a placeholder, manually fire a change event for the new value.
						if (this.props.placeholder !== undefined) {
							if (this.props.options.length > 0 && this.props.onChange) {
								this.props.onChange(this.props.options[0].id);
							}
						}
					}
				}}
				onChange={(e) => {
					if (this.props.onChange) {
						this.props.onChange(e.target.value);
					}
				}}
			>
				{this.renderOptions()}
			</select>
		);
	}
}
