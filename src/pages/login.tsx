import React from "react";
import ReactDOM from "react-dom";
window.React = React;
window.ReactDOM = ReactDOM;

import Input from "../components/common/form/input";
import PasswordInput from "../components/common/form/password-input";
import Button from "../components/common/form/button";

interface LoginState {
	username: string;
	password: string;
	page: string;
}

class Login extends React.Component<any, LoginState> {
	private usernameInput: React.RefObject<Input>;
	private passwordInput: React.RefObject<PasswordInput>;

	constructor(props: any) {
		super(props);

		const urlParams = new URLSearchParams(window.location.search);
		const pageString = urlParams.get("page") || "";

		this.state = { username: "", password: "", page: pageString };

		this.usernameInput = React.createRef();
		this.passwordInput = React.createRef();
	}

	displayError(message: string) {
		this.usernameInput.current?.setError();
		this.passwordInput.current?.setError(message);
	}

	removeError() {
		this.usernameInput.current?.removeError();
		this.passwordInput.current?.removeError();
	}

	render() {
		return (
			<div className="app login">
				<link href="/css/login.css" rel="stylesheet" />
				<div className="card">
					<h1>Login</h1>
					<p>Login to your account</p>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							const formData = new FormData();
							formData.set("username", this.state.username);
							formData.set("password", this.state.password);

							const xhr = new XMLHttpRequest();
							xhr.open("POST", "/login");
							xhr.onreadystatechange = () => {
								if (xhr.readyState === XMLHttpRequest.DONE) {
									if (xhr.status === 204) {
										const anyWindow = window as any;
										if (anyWindow.PasswordCredential) {
											const credentials = new anyWindow.PasswordCredential({
												id: this.state.username,
												password: this.state.password,
											});
											return navigator.credentials.store(credentials).then(() => {
												redirect(this.state.page);
											});
										} else {
											redirect(this.state.page);
										}
									} else if (xhr.status === 400) {
										this.displayError("Username or password is invalid.");
									}
								}
							};
							xhr.send(formData);

							function redirect(page?: string) {
								if (page) {
									location.href = window.location.origin + page;
								} else {
									location.href = window.location.origin;
								}
							}
						}}
					>
						<Input
							ref={this.usernameInput}
							name="username"
							placeholder="Username"
							value={this.state.username}
							onChange={(value: string) => {
								this.setState({ username: value });
							}}
							onClick={this.removeError.bind(this)}
						/>
						<PasswordInput
							ref={this.passwordInput}
							name="password"
							placeholder="Password"
							value={this.state.password}
							hasValidation
							onChange={(value: string) => {
								this.setState({ password: value });
							}}
							onClick={this.removeError.bind(this)}
						/>
						<div className="buttons">
							<Button name="Login" type="submit" color="blue"></Button>
							<div>
								New user? Register <a href="/register">here</a>.
							</div>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

$(() => {
	const appContainer = document.querySelector(".container");
	const login = React.createElement(Login);
	ReactDOM.render(login, appContainer);
});
