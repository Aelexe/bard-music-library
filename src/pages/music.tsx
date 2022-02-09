import React from "react";
import ReactDOM from "react-dom";
window.React = React;
window.ReactDOM = ReactDOM;

import Header from "../components/header";

// Data provided as part of the web request.
declare const music: any;

interface State {
	music: {
		title: string;
		link: string;
		description: string;
		ensembles: { name: string }[];
		instruments: { name: string }[];
		author: string;
		authorLink: string;
		views: number;
		likes: number;
		tags: { name: string; link: string }[];
		midis: { title: string; filePath: string }[];
		image?: string;
	};
	userLink?: string;
	musicLink?: string;
}

class Music extends React.Component<any, State> {
	private midiComponentRef: React.RefObject<HTMLInputElement>;
	private midiPlayer?: HTMLElement;
	private midiVisualizer?: HTMLElement;

	constructor(props: any) {
		super(props);

		console.log(music);
		const match = /user\/(.*)\/music\/(.*)$/.exec(window.location.pathname);
		const userLink = match?.[1] || undefined;
		const musicLink = match?.[2] || undefined;

		this.state = { music, userLink, musicLink };

		this.midiComponentRef = React.createRef();
	}

	componentDidMount() {
		const midiComponent = this.midiComponentRef.current!;
		this.midiPlayer = document.getElementById("midi-player")!;
		this.midiVisualizer = document.getElementById("midi-visualizer")!;
		midiComponent.append(this.midiVisualizer);
		midiComponent.append(this.midiPlayer);

		if (this.state.music.midis.length > 0) {
			this.loadMidi(this.state.music.midis[this.state.music.midis.length - 1].filePath);
		}
	}

	loadMidi(midiLink: string) {
		this.midiVisualizer?.setAttribute("src", midiLink);
		this.midiPlayer?.setAttribute("src", midiLink);
	}

	render() {
		return (
			<div className="app">
				<Header />
				<div className="music">
					<div className="details">
						<h2 className="title">{this.state.music?.title}</h2>
						<div className="below-title">
							<div className="author">
								<a href={`/user/${this.state.music?.authorLink}`}>{this.state.music?.author}</a>
							</div>
							<div className="stats">
								<div className="stat views">
									<i className="far fa-eye" />
									<span>{this.state.music?.views}</span>
								</div>
								<div className="stat likes">
									<i className="far fa-heart" />
									<span>{this.state.music?.likes}</span>
								</div>
							</div>
						</div>
						<div className="description">{this.state.music?.description}</div>
						<div className="divider" />
						<div className="ensembles">
							{this.state.music.ensembles.map((ensemble) => {
								return (
									<span key={ensemble.name} className="ensemble">
										{ensemble.name}
									</span>
								);
							})}
						</div>
						<div className="instruments">
							{this.state.music.instruments.map((instrument) => {
								return (
									<span key={instrument.name} className="instrument">
										{instrument.name}
									</span>
								);
							})}
						</div>
						<div className="tags">
							{this.state.music?.tags.map((tag) => {
								return (
									<div key={tag.link} className="tag">
										<a href={`/music/tag/${tag.link}`}>{tag.name}</a>
									</div>
								);
							})}
						</div>
						<div className="divider" />
						<div className="midis">
							{this.state.music?.midis.map((midi) => {
								return (
									<div key={midi.title} className="midi">
										<span>{midi.title}</span>
										<div className="buttons">
											<button
												onClick={() => {
													this.loadMidi(midi.filePath);
												}}
											>
												Play
											</button>
											<button>
												<a href={midi.filePath} download>
													Download
												</a>
											</button>
										</div>
									</div>
								);
							})}
						</div>
					</div>
					<div ref={this.midiComponentRef} className="midi-component"></div>
				</div>
			</div>
		);
	}
}

$(() => {
	const container = document.querySelector(".container");
	const app = React.createElement(Music);
	ReactDOM.render(app, container);
});
