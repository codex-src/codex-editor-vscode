;(() => {
	const vscode = acquireVsCodeApi()
	const initialValue = vscode.getState()

	const textarea = document.querySelector("textarea")

	// Sends messages to VSCode.
	textarea.addEventListener("input", e => {
		const { value, selectionStart, selectionEnd } = e.target
		vscode.postMessage({
			type: "input",
			value,
			selectionStart,
			selectionEnd,
		})
	})

	// // Re-render:
	// Object.assign(textarea, {
	// 	value,
	// 	selectionStart,
	// 	selectionEnd,
	// })

	// Consumes messages from VSCode.
	window.addEventListener("message", e => {
		// const { value, selectionStart, selectionEnd } = e.data
		console.log(e.data.selectionStart, textarea.selectionStart)

		const { value } = e.data
		textarea.value = value
		vscode.setState(value)
	})

	if (!initialValue) {
		textarea.focus()
	} else {
		textarea.value = initialValue
	}
})()
