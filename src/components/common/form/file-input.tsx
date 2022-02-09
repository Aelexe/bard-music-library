import React from "react";

import classnames from "classnames";
import update from "immutability-helper";

import _ from "../../../js/lodash-extended";

export interface Props {
	value?: Value;
	file?: File;
	placeholderStyle?: "text" | "icon";
	hasValidation?: boolean;
	acceptedFileTypes?: string;

	// Callbacks
	onChange?: (value?: Value) => void;
	onFileChange?: (value?: File) => void;
	onClick?: () => void;
	onBlur?: () => void;
}

interface State {
	value?: Value;
	file?: File;

	// State
	hover?: boolean;
	error?: boolean;
	validationMessage?: string;
}

export interface Value {
	name: string;
	extension: string;
	content?: string;
	path?: string;
}

export default class FileInput extends React.Component<Props, State> {
	protected className = "";
	protected acceptedFileTypes = "";
	protected clearing = false; // If the input is currently clearing, preventing additional state updates.

	// Refs
	protected input: React.RefObject<HTMLInputElement>;

	constructor(props: Props) {
		super(props);
		this.loadStateFromProps();
		this.input = React.createRef();
	}

	loadStateFromProps(): void {
		if (this.state === undefined) {
			this.state = { value: this.props.value, file: this.props.file };
			if (this.state.file && !this.state.value?.content) {
				this.loadFileDetails();
			}
		} else {
			if (!_.hasValuesOf(this.state.value, this.props.value)) {
				this.setState({ value: this.props.value });

				if (this.props.file !== this.state.file) {
					this.setState({ file: this.props.file });
				}
			}
		}
	}

	componentDidUpdate(prevProps: Props): void {
		if (_.isEqual(this.props.value, prevProps?.value)) {
			return;
		}
		this.loadStateFromProps();
	}

	setError(): void;
	setError(message: string): void;
	setError(message?: string): void {
		this.setState({ error: true, validationMessage: message });
	}

	removeError(): void {
		this.setState({ error: false, validationMessage: undefined });
	}

	clear(): void {
		if (this.input.current) {
			this.input.current.value = "";
		}
		this.clearing = true;

		const shouldFireValueEvent = this.state.value !== undefined;
		const shouldFireFileEvent = this.state.file !== undefined;

		this.setState({ value: undefined, file: undefined }, () => {
			this.clearing = false;

			if (shouldFireValueEvent && this.props.onChange) {
				this.props.onChange(undefined);
			}
			if (shouldFireFileEvent && this.props.onFileChange) {
				this.props.onFileChange(undefined);
			}
		});
	}

	onFileChange(file?: File): void {
		this.setState({ file: file }, this.loadFileDetails);

		if (this.props.onFileChange) {
			this.props.onFileChange(file);
		}
	}

	loadFileDetails(): void {
		const file = this.state.file;

		if (!file) {
			return;
		}

		const match = /^(.*)\.([^.]+)$/.exec(file.name);

		if (match === null) {
			return;
		}

		const name = match[1];
		const extension = match[2];

		const value = update(this.state.value!, { $set: { name, extension } });
		this.setState({ value }, () => {
			if (this.props.onChange !== undefined) {
				this.props.onChange(value);
			}
		});
	}

	onDragHover(e: React.DragEvent): void {
		e.preventDefault();
		e.stopPropagation();

		if (!this.state.hover) {
			this.setState({ hover: true });
		}
	}

	onDragBlur(e: React.DragEvent): void {
		e.preventDefault();
		e.stopPropagation();

		if (this.state.hover) {
			this.setState({ hover: false });
		}
	}

	onDrop(e: React.DragEvent): void {
		this.onDragBlur(e);

		this.onFileChange(e.dataTransfer.files[0]);
	}

	renderPlaceholder(): JSX.Element {
		if (this.props.placeholderStyle === "icon") {
			return (
				<div className="placeholder">
					<i className="far fa-plus-square"></i>
				</div>
			);
		} else {
			return (
				<div className="placeholder">
					<div className="select">
						<div>Select</div>
						<div className="underline"></div>
					</div>
					<span> or </span>
					<div className="drag">
						<div>drag</div>
						<div className="underline"></div>
					</div>
					<span> a file to upload</span>
				</div>
			);
		}
	}

	renderDropZone(): JSX.Element | undefined {
		if (!this.state.value) {
			return (
				<div
					className="drop-zone"
					onClick={() => {
						this.input.current?.click();
					}}
					onDragEnter={this.onDragHover.bind(this)}
					onDragOver={this.onDragHover.bind(this)}
					onDragLeave={this.onDragBlur.bind(this)}
					onDrop={this.onDrop.bind(this)}
				>
					{this.renderPlaceholder()}
				</div>
			);
		}
	}

	protected renderFile(): JSX.Element | undefined {
		if (this.state.value) {
			return (
				<div
					className="file"
					onClick={() => {
						this.input.current?.click();
					}}
				>
					<div className="name">{`${this.state.value.name}.${this.state.value.extension}`}</div>
					<div className="buttons">
						<i
							className="delete fas fa-trash-alt"
							onClick={(e) => {
								e.stopPropagation();
								this.clear();
							}}
						></i>
						<i className="edit fas fa-pencil-alt"></i>
					</div>
				</div>
			);
		}
	}

	renderValidation(): JSX.Element | undefined {
		if (this.props.hasValidation) {
			return <div className="validation">{this.state.validationMessage}</div>;
		}
	}

	render(): JSX.Element {
		return (
			<div className={classnames("file-input", this.className, { hover: this.state.hover, error: this.state.error })}>
				<div className="control">
					{this.renderDropZone()}
					{this.renderFile()}
					<input
						ref={this.input}
						type="file"
						accept={this.props.acceptedFileTypes || this.acceptedFileTypes}
						onChange={() => {
							const files = this.input.current?.files;

							if (files !== undefined && files !== null && files[0] !== undefined) {
								this.onFileChange(files[0]);
							}
						}}
					/>
				</div>
				{this.renderValidation()}
			</div>
		);
	}
}
