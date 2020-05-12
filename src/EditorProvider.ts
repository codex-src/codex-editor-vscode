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
	private static readonly viewType = "codex-v0-1-editor.md"

	// DO NOT EDIT
	constructor(private readonly context: vscode.ExtensionContext) {}

	public async resolveCustomTextEditor(
		document: vscode.TextDocument,
		webviewPanel: vscode.WebviewPanel,
		_token: vscode.CancellationToken
	): Promise<void> {

		webviewPanel.webview.options = { enableScripts: true }
		webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview)

		// Sends an update-message.
		const updateWebview = () => {
			webviewPanel.webview.postMessage({
				type: "update",
				value: document.getText(), // TODO: Change value to data or text
			})
		}

		// Converts messages passed from the editor to VSCode;
		// events are converted from messages to edits.
		webviewPanel.webview.onDidReceiveMessage(e => {
			// TODO: The editor can pass VDOM representation here,
			// use state.data to write to edit.replace, and
			const edit = new vscode.WorkspaceEdit()
			edit.replace(
				document.uri,
				new vscode.Range(
					new vscode.Position(0, 0),
					new vscode.Position(document.lineCount, 0),
				),
				e.value,
			)
			// // TODO: Add try-catch statement here
			// isSaving = true
			vscode.workspace.applyEdit(edit)
			// .then(saved => {
			// 	isSaving = saved
			// })
		})

		// Workspace subscription for document changes;
		// propagates changes to shared documents.
		const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
			console.log(document)
			if (e.document.uri.toString() !== document.uri.toString()) {
				// No-op
				return
			}
			updateWebview()
		})
		// Defer function for workspace subscription.
		webviewPanel.onDidDispose(() => {
			changeDocumentSubscription.dispose()
		})

		// Invoke once; propgate state changes to shared
		// documents once:
		updateWebview()
	}

	// Return static HTML.
	private getHtmlForWebview(webview: vscode.Webview): string {
		const nonceID = nonce()

		const scriptURI = webview.asWebviewUri(vscode.Uri.file(
			path.join(this.context.extensionPath, "static", "index.js")
		))
		const styleURI = webview.asWebviewUri(vscode.Uri.file(
			path.join(this.context.extensionPath, "static", "index.css")
		))
		return (
			`<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource}; style-src ${webview.cspSource}; script-src 'nonce-${nonceID}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleURI}" rel="stylesheet" />
				<title>Codex Editor</title>
			</head>
			<body>
				<textarea></textarea>
				<script nonce="${nonceID}" src="${scriptURI}"></script>
			</body>
			</html>`
		)
	}
}

export default EditorProvider
