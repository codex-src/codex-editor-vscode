import * as path from "path"
import * as vscode from "vscode"
import newNonce from "./nonce"

class CodexEditorProvider implements vscode.CustomTextEditorProvider {

	// DO NOT EDIT
	public static register(context: vscode.ExtensionContext): vscode.Disposable {
		const provider = new CodexEditorProvider(context)
		return vscode.window.registerCustomEditorProvider(CodexEditorProvider.viewType, provider)
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
		// Setup initial content for the webview
		webviewPanel.webview.options = {
			enableScripts: true,
		}
		webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview)

		// Synchronizes state (text) to other editors.
		const syncState = () => {
			webviewPanel.webview.postMessage({
				type: "update",
				text: document.getText(),
			})
		}

		// Hook up event handlers so that we can synchronize the webview with the text document.
		//
		// The text document acts as our model, so we have to sync change in the document to our
		// editor and sync changes in the editor back to the document.
		//
		// Remember that a single text document can also be shared between multiple custom
		// editors (this happens for example when you split a custom editor)
		const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
			if (e.document.uri.toString() !== document.uri.toString()) {
				// No-op
				return
			}
			syncState()
		})

		// Make sure we get rid of the listener when our editor is closed.
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

		// TODO: Can remove; appears to be unneeded
		// syncState()
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

		// Use a nonce to whitelist which scripts can be run
		const nonce = newNonce()
		return (
			`<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource}; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleURI}" rel="stylesheet" />
				<title>Cat Scratch</title>
			</head>
			<body>
				<textarea></textarea>
				<script nonce="${nonce}" src="${scriptURI}"></script>
			</body>
			</html>`
		)
	}

	// Commits an editing opereation; overwrites the entire
	// docuemnt.
	private commitEdit(document: vscode.TextDocument, text: string) {
		const edit = new vscode.WorkspaceEdit()
		edit.replace(
			document.uri,
			// NOTE: Overwrites the document; the third parameter, endLine, is
			// zero-based, so a 0-count overwrites the entire document.
			new vscode.Range(0, 0, document.lineCount, 0),
			text,
		)
		vscode.workspace.applyEdit(edit)
	}
}

export default CodexEditorProvider
