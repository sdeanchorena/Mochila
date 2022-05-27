"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const generate_comment_1 = require("./generate-comment");
const get_document_type_1 = require("./get-document-type");
async function insertComment(item) {
    const editor = await vscode.window.activeTextEditor;
    const startPosition = editor.selection.start;
    const beforeContent = editor.document.getText(new vscode.Range(startPosition.with(startPosition.line, 0), startPosition));
    const docType = get_document_type_1.getDocumentType(editor.document.uri.fsPath);
    let value = generate_comment_1.generateComment(item, docType);
    if (beforeContent.trim() !== '') {
        // Add whitespace if inline
        value = ' ' + value;
    }
    await editor.edit(eb => {
        eb.insert(startPosition, value);
        editor.selection = new vscode.Selection(startPosition, startPosition);
        editor.revealRange(new vscode.Range(startPosition, startPosition), vscode.TextEditorRevealType.InCenter);
    });
    await editor.document.save();
}
exports.insertComment = insertComment;
//# sourceMappingURL=insert-comment.js.map