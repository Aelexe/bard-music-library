import React from "react";

// Data provided as part of the web request.
declare const username: any;

interface Props {
	searchString?: string;
}

export default class Header extends React.Component<Props, any> {
	private searchBarRef: React.RefObject<HTMLInputElement>;

	constructor(props: Props) {
		super(props);

		this.searchBarRef = React.createRef();
	}

	render(): JSX.Element {
		return (
			<header>
				<div className="left">
					<div className="brand">
						<a href="/">
							<img src="/img/logo.png" />
							<h1>Bard Music Library</h1>
						</a>
					</div>
					<input
						ref={this.searchBarRef}
						className="search-bar"
						type="text"
						defaultValue={this.props.searchString}
						placeholder="Search for music"
						onKeyPress={(e) => {
							if (e.key === "Enter") {
								window.location.href = `/music?name=${e.currentTarget.value}`;
							}
						}}
					/>
					<a className="explore" href="/music">
						Explore
					</a>
				</div>
				<div className="right">
					<a className="upload" href="/upload">
						<i className="fas fa-arrow-circle-up"></i>
						<span>Upload</span>
					</a>
					<User />
				</div>
			</header>
		);
	}
}

class User extends React.Component<any, any> {
	private optionsRef: React.RefObject<HTMLDivElement>;

	constructor(props: any) {
		super(props);

		this.state = {};
		this.optionsRef = React.createRef();
	}

	renderOptions() {
		if (this.state.hasFocus) {
			return (
				<div
					ref={this.optionsRef}
					className="options"
					tabIndex={-1}
					onBlur={() => {
						this.setState({ hasFocus: false });
					}}
				>
					<div className="group">
						<h2>Settings</h2>
						<ul>
							<li>
								<i className="fas fa-cog"></i>
								<span>Settings</span>
							</li>
						</ul>
					</div>
					<div className="footer">
						<ul>
							<li
								onClick={() => {
									location.href = "/logout";
								}}
							>
								<a>
									<i className="fas fa-sign-out-alt" style={{ transform: "scaleX(-100%)" }}></i>
									<span>Logout</span>
								</a>
							</li>
						</ul>
					</div>
				</div>
			);
		}
	}

	render() {
		if (username) {
			return (
				<div
					className="user"
					onFocus={() => {
						this.setState({ hasFocus: true });
					}}
					onBlur={(e) => {
						// If the element receiving focus is an options element don't lose focus.
						if (this.optionsRef.current !== undefined && (e.relatedTarget as Node) === this.optionsRef.current) {
							return;
						}
						this.setState({ hasFocus: false });
					}}
					tabIndex={-1}
				>
					{username}
					{this.renderOptions()}
				</div>
			);
		} else {
			return (
				<a className="login-button" href="/login">
					Login
				</a>
			);
		}
	}
}
