import React from "react";
import ReactDOM from "react-dom";
window.React = React;
window.ReactDOM = ReactDOM;

import Header from "../components/header";

class Home extends React.Component<any, any> {
	constructor(props: any) {
		super(props);
	}

	render() {
		return (
			<div className="app">
				<Header />
				<div className="home">
					<section>
						<h1>About</h1>
						<div className="text-block">
							<p>
								A library of bard ready .midi files to be used in the critically acclaimed MMORPG Final Fantasy XIV.
								With an expanded free trial which you can play through the entirety of A Realm Reborn and the award
								winning Heavensward expansion up to level 60 for free with no restrictions on playtime.
							</p>
						</div>
					</section>
				</div>
			</div>
		);
	}
}

$(() => {
	const container = document.querySelector(".container");
	const app = React.createElement(Home);
	ReactDOM.render(app, container);
});
