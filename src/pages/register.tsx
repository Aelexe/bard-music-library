import React from "react";
import ReactDOM from "react-dom";
window.React = React;
window.ReactDOM = ReactDOM;

import Input from "../components/common/form/input";
import PasswordInput from "../components/common/form/password-input";
import Button from "../components/common/form/button";
import onDocumentReady from "../js/document-ready";

interface RegisterState {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;

	// State
	errorMessage?: string;
	submitting?: boolean;
}

class Register extends React.Component<any, RegisterState> {
	private usernameInput: React.RefObject<Input>;
	private emailInput: React.RefObject<Input>;
	private passwordInput: React.RefObject<PasswordInput>;
	private confirmPasswordInput: React.RefObject<PasswordInput>;

	constructor(props: any) {
		super(props);

		this.state = { username: "", email: "", password: "", confirmPassword: "" };

		this.usernameInput = React.createRef();
		this.emailInput = React.createRef();
		this.passwordInput = React.createRef();
		this.confirmPasswordInput = React.createRef();
	}

	displayError(message: string) {
		this.setState({ errorMessage: message });

		const lowerCaseMessage = message.toLowerCase();

		if (lowerCaseMessage.indexOf("username") !== -1) {
			this.usernameInput.current?.setError();
		}
		if (lowerCaseMessage.indexOf("password") !== -1) {
			this.passwordInput.current?.setError();
			this.confirmPasswordInput.current?.setError();
		}
		if (lowerCaseMessage.indexOf("email") !== -1) {
			this.emailInput.current?.setError();
		}
	}

	removeError() {
		this.setState({ errorMessage: undefined });
		this.usernameInput.current?.removeError();
		this.emailInput.current?.removeError();
		this.passwordInput.current?.removeError();
		this.confirmPasswordInput.current?.removeError();
	}

	submit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		// Validate inputs.
		const username = this.state.username;
		const email = this.state.email;
		const password = this.state.password;
		const confirmPassword = this.state.confirmPassword;

		const errorElements: string[] = [];
		if (!username) {
			errorElements.push("username");
		}
		if (!email) {
			errorElements.push("email");
		}
		if (!password || !confirmPassword) {
			errorElements.push("password");
		}

		if (errorElements.length > 0) {
			errorElements[0] = errorElements[0].charAt(0).toUpperCase() + errorElements[0].slice(1);
			this.displayError(errorElements.join(", ") + " must be provided.");
			return;
		}

		if (username.length < 3) {
			errorElements.push("Username must be at least 3 characters long.");
		}
		if (
			!email
				.toLowerCase()
				.match(
					/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				)
		) {
			errorElements.push("Email must be a valid email.");
		}
		if (password.length < 8) {
			errorElements.push("Password must be at least 8 characters long.");
		}
		if (password !== confirmPassword) {
			errorElements.push("Passwords must match.");
		}

		if (errorElements.length > 0) {
			this.displayError(errorElements.join(" "));
			return;
		}

		const formData = new FormData();
		formData.set("username", username);
		formData.set("email", email);
		formData.set("password", password);

		this.setState({ submitting: true });
		const xhr = new XMLHttpRequest();
		xhr.open("POST", "/register");
		xhr.onreadystatechange = () => {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				this.setState({ submitting: false });
				if (xhr.status === 204) {
					const anyWindow = window as any;
					if (anyWindow.PasswordCredential) {
						const credential = new anyWindow.PasswordCredential({
							id: username,
							password: password,
						});
						return navigator.credentials.store(credential).then(redirect, redirect);
					} else {
						redirect();
					}
				} else if (xhr.status === 400) {
					this.displayError(xhr.responseText);
				}
			}
		};
		xhr.send(formData);

		function redirect() {
			console.log("Now is redirect");
			const appContainer = document.querySelector(".container");
			const register = React.createElement(RegisterComplete);
			ReactDOM.render(register, appContainer);
		}
	}

	render() {
		return (
			<div className="app login">
				<div className="card">
					<h1>Register</h1>
					<p>Register your account</p>
					<form onSubmit={this.submit.bind(this)}>
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
						<Input
							ref={this.emailInput}
							name="email"
							placeholder="Email address"
							value={this.state.email}
							onChange={(value: string) => {
								this.setState({ email: value });
							}}
							onClick={this.removeError.bind(this)}
						/>
						<PasswordInput
							ref={this.passwordInput}
							name="password"
							placeholder="Password"
							value={this.state.password}
							onChange={(value: string) => {
								this.setState({ password: value });
							}}
							onClick={this.removeError.bind(this)}
						/>
						<PasswordInput
							ref={this.confirmPasswordInput}
							name="confirm-password"
							placeholder="Confirm password"
							value={this.state.confirmPassword}
							onChange={(value: string) => {
								this.setState({ confirmPassword: value });
							}}
							onClick={this.removeError.bind(this)}
						/>
						{this.state.errorMessage && (
							<div className="error-message">
								<i className="fas fa-exclamation"></i>
								{this.state.errorMessage}
							</div>
						)}
						<Button
							name="Register"
							type="submit"
							color="blue"
							spinner={this.state.submitting}
							disable={this.state.submitting}
						></Button>
					</form>
				</div>
			</div>
		);
	}
}

class RegisterComplete extends React.Component<any, any> {
	render() {
		return (
			<div className="app login">
				<div className="card">
					<h1>Registration Complete</h1>
					<p>Please check your email for an activation link.</p>
				</div>
			</div>
		);
	}
}

onDocumentReady(() => {
	const appContainer = document.querySelector(".container");
	const register = React.createElement(Register);
	ReactDOM.render(register, appContainer);
});
