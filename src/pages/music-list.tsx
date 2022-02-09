import React from "react";
import ReactDOM from "react-dom";
window.React = React;
window.ReactDOM = ReactDOM;

import Header from "../components/header";
import Checkbox from "../components/common/form/checkbox";

// Data provided as part of the web request.
declare const music: any;
declare const ensembles: any;
declare const instruments: any;

interface State {
	music: {
		title: string;
		link: string;
		description: string;
		author: string;
		authorLink: string;
		ensembles: { name: string }[];
		instruments: { name: string }[];
		tags: { name: string; link: string }[];
		views: number;
		likes: number;
		imagePath?: string;
	}[];
	filters: {
		ensembles: { id: number; name: string; checked?: boolean }[];
		instruments: { id: number; name: string; instrumentGroup: string; checked?: boolean }[];
		tags: string[];
	};
	searchString?: string;
}

class MusicList extends React.Component<any, State> {
	private timeout?: number;

	constructor(props: any) {
		super(props);

		const urlParams = new URLSearchParams(window.location.search);
		const searchString = urlParams.get("name") || undefined;

		const ensemblesFilter =
			urlParams
				.get("ensemble")
				?.split(",")
				.map((ensembleId) => Number(ensembleId)) || [];

		ensembles.forEach((ensemble: any) => {
			if (ensemblesFilter.indexOf(ensemble.id) !== -1) {
				ensemble.checked = true;
			}
		});

		const instrumentsFilter =
			urlParams
				.get("instruments")
				?.split(",")
				.map((instrumentId) => Number(instrumentId)) || [];

		instruments.forEach((instrument: any) => {
			if (instrumentsFilter.indexOf(instrument.id) !== -1) {
				instrument.checked = true;
			}
		});

		this.state = { music: music, filters: { ensembles: ensembles, instruments: instruments, tags: [] }, searchString };
	}

	refilter() {
		const params = new URLSearchParams();

		if (this.state.searchString) {
			params.append("name", this.state.searchString);
		}

		const ensembles = this.state.filters.ensembles
			.filter((ensemble) => {
				return ensemble.checked;
			})
			.map((ensemble) => {
				return ensemble.id;
			})
			.join(",");

		if (ensembles) {
			params.append(
				"ensemble",
				this.state.filters.ensembles
					.filter((ensemble) => {
						return ensemble.checked;
					})
					.map((ensemble) => {
						return ensemble.id;
					})
					.join(",")
			);
		}

		const instruments = this.state.filters.instruments
			.filter((instrument) => {
				return instrument.checked;
			})
			.map((instrument) => {
				return instrument.id;
			})
			.join(",");

		if (instruments) {
			params.append(
				"instruments",
				this.state.filters.instruments
					.filter((instrument) => {
						return instrument.checked;
					})
					.map((instrument) => {
						return instrument.id;
					})
					.join(",")
			);
		}

		let queryString = `?${params.toString()}`;

		if (queryString.length <= 1) {
			queryString = "";
		}

		if (this.timeout) {
			window.clearTimeout(this.timeout);
		}
		this.timeout = window.setTimeout(() => {
			window.location.href = window.location.origin + window.location.pathname + queryString;
		}, 1000);
	}

	renderInstrumentFilters() {
		const instrumentMap: { [key: string]: any[] } = {};

		this.state.filters.instruments.forEach((instrument) => {
			if (instrumentMap[instrument.instrumentGroup] === undefined) {
				instrumentMap[instrument.instrumentGroup] = [];
			}

			instrumentMap[instrument.instrumentGroup].push(instrument);
		});

		const elements: any[] = [];

		for (const [key, value] of Object.entries(instrumentMap)) {
			elements.push(
				<div className="sub-filter-group">
					<h5>{key}</h5>
					<div className="filters">
						{value.map((instrument) => {
							return (
								<div
									key={instrument.id}
									className="filter"
									onClick={() => {
										instrument.checked = !instrument.checked;
										this.setState(this.state, this.refilter);
									}}
								>
									<Checkbox value={instrument.checked} /> <span className="name">{instrument.name}</span>
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
				<Header searchString={this.state.searchString} />
				<div className="search">
					<div className="search-filters">
						<h2>Filters</h2>
						<div className="filter-groups">
							<div className="filter-group ensembles">
								<h4>Ensemble</h4>
								<div className="filters">
									{this.state.filters.ensembles.map((ensemble) => {
										return (
											<div
												key={ensemble.id}
												className="filter"
												onClick={() => {
													ensemble.checked = !ensemble.checked;
													this.setState(this.state, this.refilter);
												}}
											>
												<Checkbox value={ensemble.checked} /> <span className="name">{ensemble.name}</span>
											</div>
										);
									})}
								</div>
							</div>
							<div className="filter-group instruments">
								<h4>Instruments</h4>
								<div className="filters">{this.renderInstrumentFilters()}</div>
							</div>
						</div>
					</div>
					<div className="search-results">
						<h2>{this.state.searchString ? `Search results for '${this.state.searchString}'` : "Top Rated Music"}</h2>
						<div className="results">
							{this.state.music.map((music) => {
								return (
									<div key={music.link} className="result">
										{music.imagePath && (
											<div className="image">
												<img src={music.imagePath} />
											</div>
										)}
										<div className="text">
											<h3 className="title">
												<a href={`/user/${music.author.toLowerCase().replace(" ", "-")}/music/${music.link}`}>
													{music.title}
												</a>
											</h3>
											<div className="below-title">
												<div className="author">
													<a href={`/user/${music.authorLink}`}>{music.author}</a>
												</div>
												<div className="stats">
													<div className="stat views">
														<i className="far fa-eye" />
														<span>{music.views}</span>
													</div>
													<div className="stat likes">
														<i className="far fa-heart" />
														<span>{music.likes}</span>
													</div>
												</div>
											</div>
											<div className="description">{music.description}</div>
											<div className="tags">
												{music.tags.map((tag) => {
													return (
														<div key={tag.link} className="tag">
															<a href={`/music/tag/${tag.link}`}>{tag.name}</a>
														</div>
													);
												})}
											</div>
											<div className="ensembles">
												{music.ensembles.map((ensemble) => {
													return (
														<span key={ensemble.name} className="ensemble">
															{ensemble.name}
														</span>
													);
												})}
											</div>
											<div className="instruments">
												{music.instruments.map((instrument) => {
													return (
														<span key={instrument.name} className="instrument">
															{instrument.name}
														</span>
													);
												})}
											</div>
										</div>
									</div>
								);
							})}
							{this.state.music.length === 0 && <div className="no-results">There are no results for this search.</div>}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

$(() => {
	const container = document.querySelector(".container");
	const app = React.createElement(MusicList);
	ReactDOM.render(app, container);
});
