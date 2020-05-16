import * as vscode from "vscode";
import { join } from "path";
import { EditorProvider } from "./EditorProvider";

export function activate(context: vscode.ExtensionContext) {

    (global as any).reload = () => {
        vscode.commands.executeCommand("workbench.action.reloadWindow");
    };

    vscode.window.registerCustomEditorProvider(
        "codex-v0-1-editor.md",
        new EditorProvider(join(context.extensionPath, "static"))
    );
}
