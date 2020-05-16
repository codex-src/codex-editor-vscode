;(() => {
	const vscode = acquireVsCodeApi()
	const initialValue = vscode.getState()

	const contenteditable = document.querySelector("[contenteditable]")

	// Sends messages to VSCode.
	contenteditable.addEventListener("input", e => {
		// // TODO: postMessage needs to pass data; not cursors
		// // const { value, selectionStart, selectionEnd } = e.target
		// const { value: data } = e.target
		const data = contenteditable.innerHTML
		vscode.postMessage({
			type: "input",
			data,
			p1: Date.now(),
			p2: Date.now(),
		})
	})

	// Consumes messages from VSCode.
	window.addEventListener("message", e => {
		const { data, pos1, pos2 } = e.data
		console.log(pos1, pos2)

		// Returns a function that restores the cursors back to
		// where they where.
		const resetPos = (() => {
			const selection = document.getSelection()
			if (!selection.rangeCount) {
				return null
			}
			const { anchorNode, anchorOffset, focusNode, focusOffset } = selection
			const reset = () => {
				const range = document.createRange()
				range.setStart(contenteditable.childNodes[0], anchorOffset)
				range.setEnd(contenteditable.childNodes[0], focusOffset)
				selection.removeAllRanges()
				selection.addRange(range)
			}
			return reset
		})()

		// // TODO: Get nodes, pos1, and pos2 here
		// const { selectionStart, selectionEnd } = contenteditable
		// const resetPos = () => {
		// 	Object.assign(contenteditable, {
		// 		selectionStart,
		// 		selectionEnd,
		// 	})
		// }

		// TODO (1): Compare e.data.split("\n") vs. nodes and
		// mutate affected nodes. Pass nodes, pos1, and pos2
		// back to the editor to re-render.
		// TODO (2): Can use syncDOM strategy to mutate affected
		// nodes
		contenteditable.innerHTML = data
		if (resetPos) {
			resetPos()
		}

		vscode.setState(data)
	})

	if (!initialValue) {
		contenteditable.focus()
	} else {
		// contenteditable.value = initialValue
		contenteditable.innerHTML = initialValue
	}
})()
