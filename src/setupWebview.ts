import { Webview, Uri } from "vscode";
import { join } from "path";

export function setupWebview(webview: Webview, staticPath: string): void {
	webview.options = { enableScripts: true };

	// TODO: Can use ?embed=1 or =true flag as an env variable
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
		<script>
			const api = window.VsCodeApi = acquireVsCodeApi();
			window.addEventListener('message', event => {
				const iframe = window.frames[0];
				if (event.source === iframe) {
					console.log("forward message: frame -> vscode", event.data);
					api.postMessage(event.data);
				} else {
					console.log("forward message: vscode -> frame", event.data);
					iframe.postMessage(event.data, "*");
				}
			});
		</script>
	</head>
	<body>
		<iframe src="http://localhost:3000?embed=true"></iframe>
	</body>
    </html>`;

	webview.html = html;
}
