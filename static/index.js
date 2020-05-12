// ;(() => {
// 	// Get the VSCode API and document state:
// 	const vscode = acquireVsCodeApi()
// 	const documentState = vscode.getState()
//
// 	const textarea = document.querySelector("textarea")
// 	if (documentState) {
// 		textarea.value = state.text // TODO
// 	}
//
// 	// Sends a message to VSCode.
// 	textarea.addEventListener("input", e => {
// 		const text = e.target.value
// 		vscode.postMessage({
// 			type:, "input",
// 			text,
// 		})
// 	})
//
// 	// Consumes a message from VSCode.
// 	window.addEventListener("message", e => {
// 		const message = e.data
// 		textarea.value = message.text // TODO
//
// 		// TODO: Remove?
// 		vscode.setState({ text: message.text })
// 	})
// })()

(() => {
	const vscode = acquireVsCodeApi()
	const state = vscode.getState()

	const textarea = document.querySelector("textarea")
	if (state) {
		textarea.value = state.text // TODO
	}

	// Sends messages to VSCode.
	textarea.addEventListener("input", e => {
		const text = e.target.value
		vscode.postMessage({
			type: "input", // TODO: Can remove
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
