import React from "react";

import FileInput from "./file-input";
import update from "immutability-helper";

export default class ImageInput extends FileInput {
	protected className = "image";
	protected acceptedFileTypes = ".jpg,.jpeg,.png";

	loadFileDetails(): void {
		const image = this.state.file;

		if (!image) {
			return;
		}

		const match = /^(.*)\.([^.]+)$/.exec(image.name);

		if (match === null) {
			return;
		}

		const name = match[1];
		const extension = match[2];

		const reader = new FileReader();
		reader.onloadend = () => {
			const resultString: string = reader.result! as string;
			const content = resultString.replace("data:", "").replace(/^.+,/, "");

			const value = update(this.state.value!, { $set: { name, extension, content } });
			this.setState({ value }, () => {
				if (this.props.onChange !== undefined) {
					this.props.onChange(value);
				}
			});
		};
		reader.readAsDataURL(image);
	}

	renderFile(): JSX.Element | undefined {
		if (this.state.value) {
			let src = "";
			if (this.state.file) {
				src = URL.createObjectURL(this.state.file);
			} else if (this.state.value) {
				src = `/content${this.state.value.path}`;
			}
			return (
				<div
					className="thumbnail"
					onClick={() => {
						this.input.current?.click();
					}}
				>
					<img src={src}></img>
					<i
						className="delete fas fa-trash-alt"
						onClick={(e) => {
							e.stopPropagation();
							this.clear();
						}}
					></i>
					<i className="edit fas fa-pencil-alt"></i>
				</div>
			);
		}
	}
}
