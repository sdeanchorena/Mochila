"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
async function editComment(item, value) {
    const editor = await vscode.window.showTextDocument(item.uri);
    let startPosition = editor.document.positionAt(item.position);
    await editor.edit(eb => {
        const endPosition = startPosition.with(startPosition.line, item.position + item.length);
        eb.replace(new vscode.Range(startPosition, endPosition), value);
        editor.selection = new vscode.Selection(startPosition, startPosition);
        editor.revealRange(new vscode.Range(startPosition, startPosition), vscode.TextEditorRevealType.InCenter);
    });
    await editor.document.save();
}
exports.editComment = editComment;
//# sourceMappingURL=edit-comment.js.map