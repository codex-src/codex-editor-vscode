import * as path from "path";
import nonce from "./nonce";
import {
    CustomTextEditorProvider,
    TextDocument,
    WebviewPanel,
    CancellationToken,
    WorkspaceEdit,
    Range,
    Position,
    workspace,
    Webview,
    commands,
} from "vscode";
import { setupWebview } from "./setupWebview";


type CodexAction = {
    kind: "load";
    markdown: string;
} | {
    kind: "update";
};

type CodexEvent = {
    kind: "update";
    newMarkdown: string;
} | {
    kind: "init";
};

export class EditorProvider implements CustomTextEditorProvider {
    constructor(private readonly staticPath: string) { }

    public async resolveCustomTextEditor(
        document: TextDocument,
        webviewPanel: WebviewPanel,
        _token: CancellationToken
    ): Promise<void> {
        function sendAction(action: CodexAction) {
            webviewPanel.webview.postMessage(action);
        }

        webviewPanel.webview.onDidReceiveMessage((e: CodexEvent) => {
            if (e.kind === "init") {
                sendAction({
                    kind: "load",
                    markdown: document.getText()
                })
            }
        });

        setupWebview(webviewPanel.webview, this.staticPath);

        let isSaving = false;
        const update = async (newContent: string) => {
            const edit = new WorkspaceEdit();
            edit.replace(
                document.uri,
                new Range(
                    new Position(0, 0),
                    new Position(document.lineCount, 0)
                ),
                newContent
            );

            isSaving = true;
            await workspace.applyEdit(edit);
            isSaving = false;
        }

        // Workspace subscription for document changes;
        // propagates changes to shared documents.
        const changeDocumentSubscription = workspace.onDidChangeTextDocument(
            (e) => {
                if (e.document.uri.toString() !== document.uri.toString()) {
                    return;
                }

            }
        );

    }
}
