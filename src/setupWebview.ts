import { Webview, Uri } from "vscode";
import { join } from "path";

export function setupWebview(webview: Webview, staticPath: string): void {
    webview.options = { enableScripts: true };

    /*const scriptURI = webview.asWebviewUri(
        Uri.file(join(staticPath, "static", "index.js"))
    );
    const styleURI = webview.asWebviewUri(
        Uri.file(join(staticPath, "static", "index.css"))
    );*/
    const html = `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="Content-Security-Policy" content="default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline'; worker-src * data: 'unsafe-inline' 'unsafe-eval'; font-src * 'unsafe-inline' 'unsafe-eval';">
			
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<style>
			html { height: 100%; width: 100%; padding: 0; margin: 0; }
			body { height: 100%; width: 100%; padding: 0; margin: 0; }
			iframe { height: 100%; width: 100%; padding: 0; margin: 0; border: 0; display: block; }
		</style>
		<title>Codex Editor</title>
	</head>
	<body>
		<div contenteditable></div>
		<iframe src="http://localhost:3000"></iframe>
	</body>
    </html>`;

    webview.html = html;
}
