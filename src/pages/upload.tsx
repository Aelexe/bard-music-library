import React from "react";
import ReactDOM from "react-dom";
window.React = React;
window.ReactDOM = ReactDOM;

import Header from "../components/header";
import Input from "../components/common/form/input";
import Button from "../components/common/form/button";
import TextArea from "../components/common/form/textarea";
import Checkbox from "../components/common/form/checkbox";
import Field from "../components/common/form/field";
import FileInput from "../components/common/form/file-input";
import ImageInput from "../components/common/form/image-input";

// Data provided as part of the web request.
declare const ensembles: any;
declare const instruments: any;

interface State {
	// Value
	title?: string;
	description?: string;
	image?: File;
	ensembles: number[];
	instruments: number[];
	midis: { title?: string; file?: File }[];

	// State
	errorMessage?: string;
	submitting?: boolean;
}

class Upload extends React.Component<any, State> {
	private usernameInput: React.RefObject<Input>;
	private descriptionInput: React.RefObject<TextArea>;

	constructor(props: any) {
		super(props);

		this.state = { ensembles: [], instruments: [], midis: [{}] };

		this.usernameInput = React.createRef();
		this.descriptionInput = React.createRef();
	}

	submit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		// Validate inputs.
		const title = this.state.title;
		const description = this.state.description;
		const image = this.state.image;
		const ensembles = this.state.ensembles;
		const instruments = this.state.instruments;
		const midis = this.state.midis;

		const errorElements: string[] = [];
		if (!title) {
			errorElements.push("title");
		}
		if (!description) {
			errorElements.push("description");
		}

		if (errorElements.length > 0) {
			errorElements[0] = errorElements[0].charAt(0).toUpperCase() + errorElements[0].slice(1);
			this.displayError(errorElements.join(", ") + " must be provided.");
			return;
		}

		const formData = new FormData();
		formData.set("title", title!);
		formData.set("description", description!);

		if (image) {
			formData.set("image", image);
		}
		formData.set("ensembles", ensembles.join(","));
		formData.set("instruments", instruments.join(","));

		midis?.forEach((midi, i) => {
			if (midi.title && midi.file) {
				formData.set(`midi${i}`, midi.file, midi.title);
			}
		});

		this.setState({ submitting: true });
		const xhr = new XMLHttpRequest();
		xhr.open("POST", "/upload");
		xhr.onreadystatechange = () => {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				this.setState({ submitting: false });
				if (xhr.status === 201) {
					location.href = window.location.origin + xhr.getResponseHeader("Location");
				} else if (xhr.status === 400) {
					this.displayError(xhr.responseText);
				}
			}
		};
		xhr.send(formData);
	}

	displayError(message: string) {
		this.setState({ errorMessage: message });

		const lowerCaseMessage = message.toLowerCase();

		if (lowerCaseMessage.indexOf("username") !== -1) {
			this.usernameInput.current?.setError();
		}
		if (lowerCaseMessage.indexOf("email") !== -1) {
			this.descriptionInput.current?.setError();
		}
	}

	removeError() {
		this.setState({ errorMessage: undefined });
		this.usernameInput.current?.removeError();
	}

	renderInstruments() {
		const instrumentMap: { [key: string]: any[] } = {};

		instruments.forEach((instrument: any) => {
			if (instrumentMap[instrument.instrumentGroup] === undefined) {
				instrumentMap[instrument.instrumentGroup] = [];
			}

			instrumentMap[instrument.instrumentGroup].push(instrument);
		});

		const elements: any[] = [];

		for (const [key, value] of Object.entries(instrumentMap)) {
			elements.push(
				<div className="instrument-group">
					<h5>{key}</h5>
					<div className="instruments">
						{value.map((instrument) => {
							return (
								<div
									key={instrument.id}
									className="instrument"
									onClick={() => {
										if (this.state.instruments.includes(instrument.id)) {
											this.state.instruments.splice(this.state.instruments.indexOf(instrument.id));
										} else {
											this.state.instruments.push(instrument.id);
										}

										this.setState({ instruments: this.state.instruments });
									}}
								>
									<Checkbox value={this.state.instruments.includes(instrument.id)} />{" "}
									<span className="name">{instrument.name}</span>
								</div>
							);
						})}
					</div>
				</div>
			);
		}

		return elements;
	}

	render() {
		return (
			<div className="app">
				<Header />
				<div className="upload">
					<div className="content">
						<h2>Upload</h2>
						<form onSubmit={this.submit.bind(this)}>
							<Field name="Title" style="row">
								<Input
									ref={this.usernameInput}
									name="title"
									placeholder="Title"
									value={this.state.title}
									onChange={(value: string) => {
										this.setState({ title: value });
										if (
											(this.state.midis.length === 1 && this.state.midis[0].title?.indexOf(value) === 0) ||
											value.indexOf(this.state.midis[0].title || "") === 0
										) {
											this.state.midis[0].title = value;
											this.setState({ midis: this.state.midis });
										}
									}}
									onClick={this.removeError.bind(this)}
								/>
							</Field>
							<Field name="Description" style="row">
								<TextArea
									ref={this.descriptionInput}
									name="description"
									placeholder="Description"
									value={this.state.description}
									onChange={(value: string) => {
										this.setState({ description: value });
									}}
									onClick={this.removeError.bind(this)}
								/>
							</Field>
							<Field name="Image" style="row">
								<ImageInput
									onFileChange={(file?: File) => {
										this.setState({ image: file });
									}}
								/>
							</Field>
							<Field name="Ensembles" style="row">
								<div className="ensembles-input">
									{ensembles.map((ensemble: any) => {
										return (
											<div
												key={ensemble.id}
												className="ensemble"
												onClick={() => {
													if (this.state.ensembles.includes(ensemble.id)) {
														this.state.ensembles.splice(this.state.ensembles.indexOf(ensemble.id));
													} else {
														this.state.ensembles.push(ensemble.id);
													}

													this.setState({ ensembles: this.state.ensembles });
												}}
											>
												<Checkbox value={this.state.ensembles.includes(ensemble.id)} />{" "}
												<span className="name">{ensemble.name}</span>
											</div>
										);
									})}
								</div>
							</Field>
							<Field name="Ensembles" style="row">
								<div className="instruments-input">{this.renderInstruments()}</div>
							</Field>
							<Field name="Midis" style="row">
								<div className="midi-inputs">
									{this.state.midis?.map((midi, i) => {
										return (
											<MidiInput
												key={midi.title}
												title={midi.title}
												showDelete={this.state.midis.length > 1}
												onChange={(midi) => {
													this.state.midis[i] = midi;
													this.setState({ midis: this.state.midis });
												}}
												onDelete={() => {
													this.state.midis.splice(i, 1);
													this.setState({ midis: this.state.midis });
												}}
											/>
										);
									})}
									<div className="button">
										<i
											className="add fas fa-plus"
											onClick={() => {
												this.state.midis.push({});
												this.setState({ midis: this.state.midis });
											}}
										></i>
									</div>
								</div>
							</Field>
							{this.state.errorMessage && (
								<div className="error-message">
									<i className="fas fa-exclamation"></i>
									{this.state.errorMessage}
								</div>
							)}
							<div className="row right">
								<Button
									name="Upload"
									type="submit"
									color="blue"
									spinner={this.state.submitting}
									disable={this.state.submitting}
								></Button>
							</div>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

interface MidiInputProps {
	title?: string;
	showDelete?: boolean;

	// Callbacks
	onChange?: (value: { title?: string; file?: File }) => void;
	onDelete?: () => void;
}

interface MidiInputState {
	title?: string;
	file?: File;
}

class MidiInput extends React.Component<MidiInputProps, MidiInputState> {
	constructor(props: MidiInputProps) {
		super(props);

		this.loadStateFromProps();
	}

	componentDidUpdate(prevProps: MidiInputProps) {
		if (prevProps.title !== this.props.title) {
			this.loadStateFromProps();
		}
	}

	loadStateFromProps() {
		if (this.state === undefined) {
			this.state = { title: this.props.title };
		} else {
			this.setState({ title: this.props.title });
		}
	}

	onChange() {
		if (this.props.onChange) {
			this.props.onChange({ title: this.state.title, file: this.state.file });
		}
	}

	onDelete() {
		if (this.props.onDelete) {
			this.props.onDelete();
		}
	}

	render() {
		return (
			<div className="midi-input">
				<div className="inputs">
					<Input
						name="midi-name"
						value={this.state.title}
						placeholder="Midi name"
						onChange={(title) => {
							this.setState({ title }, this.onChange);
						}}
					></Input>
					<FileInput
						acceptedFileTypes=".mid,.midi"
						onFileChange={(file) => {
							this.setState({ file }, this.onChange);
						}}
					/>
				</div>

				{this.props.showDelete && (
					<div className="buttons">
						<i className="delete fas fa-trash-alt" onClick={this.onDelete.bind(this)}></i>
					</div>
				)}
			</div>
		);
	}
}

$(() => {
	const container = document.querySelector(".container");
	const app = React.createElement(Upload);
	ReactDOM.render(app, container);
});
