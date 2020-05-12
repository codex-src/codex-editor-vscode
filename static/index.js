;(() => {
	const vscode = acquireVsCodeApi()
	const initialValue = vscode.getState()

	const textarea = document.querySelector("textarea")

	// Sends messages to VSCode.
	textarea.addEventListener("input", e => {
		// TODO: postMessage needs to pass data; not cursors
		// const { value, selectionStart, selectionEnd } = e.target
		const { value: data } = e.target
		vscode.postMessage({
			type: "input",
			data,
		})
	})

	// Consumes messages from VSCode.
	window.addEventListener("message", e => {
		// NOTE: Destructure e.data
		const { data } = e.data

		// TODO: Get nodes, pos1, and pos2 here
		const { selectionStart, selectionEnd } = textarea
		const resetPos = () => {
			Object.assign(textarea, {
				selectionStart,
				selectionEnd,
			})
		}

		// TODO (1): Compare e.data.split("\n") vs. nodes and
		// mutate affected nodes. Pass nodes, pos1, and pos2
		// back to the editor to re-render.
		// TODO (2): Can use syncDOM strategy to mutate affected
		// nodes
		textarea.value = data
		resetPos()

		vscode.setState(data)
	})

	if (!initialValue) {
		textarea.focus()
	} else {
		textarea.value = initialValue
	}
})()
