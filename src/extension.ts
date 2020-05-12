import * as vscode from "vscode"
import EditorProvider from "./EditorProvider"

// Regisers extension (uses provider).
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(EditorProvider.register(context))
}
