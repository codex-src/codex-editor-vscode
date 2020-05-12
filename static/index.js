;(() => {
	const vscode = acquireVsCodeApi()
	const initialValue = vscode.getState()

	const textarea = document.querySelector("textarea")

	// Sends messages to VSCode.
	textarea.addEventListener("input", e => {
		const { value, selectionStart, selectionEnd } = e.target
		// console.log({ value, selectionStart, selectionEnd })
		vscode.postMessage({
			type: "input",
			value,
			selectionStart,
			selectionEnd,
		})
	})

	// Consumes messages from VSCode.
	window.addEventListener("message", e => {
		const { value, selectionStart, selectionEnd } = e.data
		textarea.value = value
		// // Re-render:
		// Object.assign(textarea, {
		// 	value,
		// 	selectionStart,
		// 	selectionEnd,
		// })
		vscode.setState(value)
	})

	// FIXME: Use autofocus="true"
	if (!initialValue) {
		textarea.focus()
	} else {
		textarea.value = initialValue
	}
})()
