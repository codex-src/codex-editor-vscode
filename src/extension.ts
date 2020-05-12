import * as vscode from "vscode"
import EditorProvider from "./EditorProvider"

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(EditorProvider.register(context))
}
