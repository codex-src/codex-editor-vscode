import { Webview, Uri } from "vscode";
import { join } from "path";

export function setupWebview(webview: Webview, staticPath: string): void {
    webview.options = { enableScripts: true };

    const scriptURI = webview.asWebviewUri(
        Uri.file(join(staticPath, "static", "index.js"))
    );
    const styleURI = webview.asWebviewUri(
        Uri.file(join(staticPath, "static", "index.css"))
    );
    const html = `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource}; style-src ${webview.cspSource};">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link href="${styleURI}" rel="stylesheet" />
		<title>Codex Editor</title>
	</head>
	<body>
		<div contenteditable></div>
		<script src="${scriptURI}"></script>
	</body>
    </html>`;

    webview.html = html;
}
