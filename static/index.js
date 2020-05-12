;(() => {
	const vscode = acquireVsCodeApi()
	const vscodeState = vscode.getState()

	const textarea = document.querySelector("textarea")

	// Sends messages to VSCode.
	textarea.addEventListener("input", e => {
		// console.log("sent a message to vscode")

		const text = e.target.value
		vscode.postMessage({
			type: "input",
			text,
		})
	})

	// Consumes messages from VSCode.
	window.addEventListener("message", e => {
		// console.log("consumed a message from vscode")

		const message = e.data
		textarea.value = message.text // TODO
		vscode.setState({
			text: message.text,
		})
	})

	if (vscodeState) {
		textarea.value = vscodeState.text // TODO
	}
})()
