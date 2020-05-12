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
		const { selectionStart, selectionEnd } = textarea
		const resetPos = () => {
			Object.assign(textarea, {
				selectionStart,
				selectionEnd,
			})
		}

		const { value } = e.data
		textarea.value = value
		resetPos()

		vscode.setState(value)
	})

	if (!initialValue) {
		textarea.focus()
	} else {
		textarea.value = initialValue
	}
})()
