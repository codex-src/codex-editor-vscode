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
} from "vscode";
import { setupWebview } from "./setupWebview";


export class EditorProvider implements CustomTextEditorProvider {
    constructor(private readonly staticPath: string) {}

    public async resolveCustomTextEditor(
        document: TextDocument,
        webviewPanel: WebviewPanel,
        _token: CancellationToken
    ): Promise<void> {
        setupWebview(webviewPanel.webview, this.staticPath);

        let pos1 = 0;
        let pos2 = 0;

        const updateWebview = ([pos1, pos2]: any) => {
            webviewPanel.webview.postMessage({
                type: "update",
                data: document.getText(),
                pos1,
                pos2,
            });
        };

        webviewPanel.webview.onDidReceiveMessage((e) => {
            const { data, p1, p2 } = e;
            pos1 = p1;
            pos2 = p2;

            // TODO: The editor can pass VDOM representation here,
            // use state.data to write to edit.replace, and
            const edit = new WorkspaceEdit();
            edit.replace(
                document.uri,
                new Range(
                    new Position(0, 0),
                    new Position(document.lineCount, 0)
                ),
                data
            );
            // // TODO: Add try-catch statement here
            // isSaving = true
            workspace.applyEdit(edit);
            // .then(saved => {
            // 	isSaving = saved
            // })
        });

        // Workspace subscription for document changes;
        // propagates changes to shared documents.
        const changeDocumentSubscription = workspace.onDidChangeTextDocument(
            (e) => {
                // console.log(e)

                if (e.document.uri.toString() !== document.uri.toString()) {
                    // No-op
                    return;
                }
                updateWebview([pos1, pos2]);
            }
        );
        // Defer function for workspace subscription.
        webviewPanel.onDidDispose(() => {
            changeDocumentSubscription.dispose();
        });

        // Invoke once; propgate state changes to shared
        // documents once:
        updateWebview([pos1, pos2]);
    }
}
