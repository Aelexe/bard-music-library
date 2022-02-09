abstract class InputComponent<
	P = Record<string, unknown>,
	S = Record<string, unknown>,
	SS = any
> extends React.Component<P, S, SS> {
	setError(): void;
	setError(message: string): void;
	setError(message?: string): void {
		this.setState({ error: true, validationMessage: message } as any);
	}

	removeError(): void {
		this.setState({ error: false, validationMessage: undefined } as any);
	}
}

export default InputComponent;
