;(() => {
	const vscode = acquireVsCodeApi()
	const vscodeState = vscode.getState()

	const textarea = document.querySelector("textarea")

	// Sends messages to VSCode.
	textarea.addEventListener("input", e => {
		// const { value, selectionStart, selectionEnd } = e.target // Or textarea

		const { value } = e.target
		vscode.postMessage({
			type: "input",
			value,
		})
	})

	// Consumes messages from VSCode.
	window.addEventListener("message", e => {
		const message = e.data
		textarea.value = message.value
		vscode.setState({
			value: message.value,
		})
	})

	if (vscodeState) {
		textarea.value = vscodeState.value
	}
})()
