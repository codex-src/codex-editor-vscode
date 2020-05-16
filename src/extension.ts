import * as vscode from "vscode";
import { join } from "path";
import { EditorProvider } from "./EditorProvider";

export function activate(context: vscode.ExtensionContext) {


    (global as any).reload = () => {
        vscode.commands.executeCommand("workbench.action.reloadWindow");

    };

    (global as any).reloadDocument = async () => {
        await vscode.commands.executeCommand("workbench.action.closeAllEditors");
        const doc = await vscode.workspace.openTextDocument(vscode.Uri.file("/Users/zaydek/Desktop/test2.md"));
        vscode.window.showTextDocument(doc, {});
    };


    vscode.window.registerCustomEditorProvider(
        "codex-v0-1-editor.md",
        new EditorProvider(join(context.extensionPath, "static")), {
        webviewOptions: {
            retainContextWhenHidden: true
        }
    }
    );
}
