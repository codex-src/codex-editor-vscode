import * as path from "path"
import * as vscode from "vscode"
import nonce from "./nonce"

class EditorProvider implements vscode.CustomTextEditorProvider {

	// DO NOT EDIT
	public static register(context: vscode.ExtensionContext): vscode.Disposable {
		const provider = new EditorProvider(context)
		return vscode.window.registerCustomEditorProvider(EditorProvider.viewType, provider)
	}

	// DO NOT EDIT
	private static readonly viewType = "catCustoms.catScratch"

	// DO NOT EDIT
	constructor(
		private readonly context: vscode.ExtensionContext
	) { }

	/**
	 * Called when our custom editor is opened.
	 *
	 *
	 */
	public async resolveCustomTextEditor(
		document: vscode.TextDocument,
		webviewPanel: vscode.WebviewPanel,
		_token: vscode.CancellationToken
	): Promise<void> {

		webviewPanel.webview.options = {
			enableScripts: true,
		}
		webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview)

		// Propagates state changes.
		const propagateState = () => {
			webviewPanel.webview.postMessage({
				type: "update",
				text: document.getText(),
			})
		}

		// useEffect (for the frontmost editor; background
		// editors need to be idempotent).
		const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
			if (e.document.uri.toString() !== document.uri.toString()) {
				// No-op
				return
			}
			propagateState()
		})
		// Defer function in useEffect.
		webviewPanel.onDidDispose(() => {
			changeDocumentSubscription.dispose()
		})

		// Receive message from the webview.
		webviewPanel.webview.onDidReceiveMessage(e => {
			switch (e.type) {
			case "edit":
				this.commitEdit(document, e.text)
				return
			}
		})

		// NOTE: Not needed for the frontmost editor; neede for
		// background editors
		propagateState()
	}

	/**
	 * Get the static html used for the editor webviews.
	 */
	private getHtmlForWebview(webview: vscode.Webview): string {
		// Path for JS and CSS to interpolate
		const scriptURI = webview.asWebviewUri(vscode.Uri.file(
			path.join(this.context.extensionPath, "media", "catScratch.js")
		))
		const styleURI = webview.asWebviewUri(vscode.Uri.file(
			path.join(this.context.extensionPath, "media", "catScratch.css")
		))

		const nonceID = nonce()
		return (
			`<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource}; style-src ${webview.cspSource}; script-src 'nonce-${nonceID}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleURI}" rel="stylesheet" />
				<title>Cat Scratch</title>
			</head>
			<body>
				<textarea></textarea>
				<script nonce="${nonceID}" src="${scriptURI}"></script>
			</body>
			</html>`
		)
	}

	// Commits an editing operation; overwrites the document.
	private commitEdit(document: vscode.TextDocument, text: string) {
		const edit = new vscode.WorkspaceEdit()
		edit.replace(
			document.uri,
			// NOTE: Overwrites the document; the third parameter,
			// endLine, is zero-based, so a 0-count overwrites the
			// document
			new vscode.Range(0, 0, document.lineCount, 0),
			text,
		)
		vscode.workspace.applyEdit(edit)
	}
}

export default EditorProvider
