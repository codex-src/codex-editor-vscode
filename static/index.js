;(() => {
	const vscode = acquireVsCodeApi()
	const initialState = vscode.getState()

	const textarea = document.querySelector("textarea")
	if (initialState) {
		textarea.value = initialState.text // TODO
	}

	// Sends messages to VSCode.
	textarea.addEventListener("input", e => {
		const text = e.target.value
		vscode.postMessage({
			type: "input",
			text,
		})
	})

	// Consumes messages from VSCode.
	window.addEventListener("message", event => {
		const message = event.data
		textarea.value = message.text // TODO
		vscode.setState({ text: message.text })
	})
})()
