;(() => {
	const vscode = acquireVsCodeApi()
	const vscodeState = vscode.getState()

	const contenteditable = document.querySelector("[contenteditable]")

	// Sends messages to VSCode.
	contenteditable.addEventListener("input", e => {
		// console.log("sent a message to vscode")

		const text = contenteditable.innerHTML // e.target.value
		vscode.postMessage({
			type: "input",
			text,
		})
	})

	// Consumes messages from VSCode.
	window.addEventListener("message", e => {
		// console.log("consumed a message from vscode")

		const message = e.data
		// contenteditable.value = message.text
		contenteditable.innerHTML = message.text
		vscode.setState({
			text: message.text,
		})
	})

	if (vscodeState) {
		// contenteditable.value = vscodeState.text
		contenteditable.innerHTML = vscodeState.text
	}
})()
