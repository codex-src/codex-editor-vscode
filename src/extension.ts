import * as vscode from "vscode"
import CodexEditorProvider from "./CodexEditorProvider"

export function activate(context: vscode.ExtensionContext) {
	// Register our custom editor providers
	context.subscriptions.push(CodexEditorProvider.register(context))
}
