"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class TodoUriHandler {
    handleUri(uri) {
        switch (uri.path.toLowerCase()) {
            case '/view':
                this.handleView(uri);
                break;
            default:
                return;
        }
    }
    async handleView(uri) {
        try {
            const filename = decodeURIComponent(uri.query.substring(5));
            const position = +uri.fragment;
            const editor = await vscode.window.showTextDocument(vscode.Uri.parse('file:///' + filename));
            const startPosition = editor.document.positionAt(position);
            editor.selection = new vscode.Selection(startPosition, startPosition);
            editor.revealRange(new vscode.Range(startPosition, startPosition));
        }
        catch (e) {
            console.error(e);
        }
    }
}
exports.TodoUriHandler = TodoUriHandler;
//# sourceMappingURL=uri-handler.js.map