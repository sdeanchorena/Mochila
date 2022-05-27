"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
async function openResource(resource, position) {
    const editor = await vscode.window.showTextDocument(resource);
    const pos = editor.document.positionAt(position);
    editor.revealRange(new vscode.Range(pos, pos), vscode.TextEditorRevealType.InCenter);
    editor.selection = new vscode.Selection(pos, pos);
}
exports.openResource = openResource;
//# sourceMappingURL=open-resource.js.map