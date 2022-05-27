"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class Deocrator {
    constructor(context, config) {
        this.config = config;
        this.listeners = [];
        this.commentTypeStyle = vscode.window.createTextEditorDecorationType({ color: '#ffaa00' });
        this.commentContentStyle = vscode.window.createTextEditorDecorationType({ fontStyle: 'italic' });
        if (config.enableCommentFormatting) {
            this.registerListeners();
        }
    }
    updateConfiguration(config) {
        this.config = config;
        if (config.enableCommentFormatting && this.listeners.length === 0) {
            this.registerListeners();
        }
        if (!config.enableCommentFormatting) {
            this.unregisterListeners();
        }
    }
    registerListeners() {
        let activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            this.updateDecorations(vscode.window.activeTextEditor, this.config);
        }
        this.listeners.push(vscode.window.onDidChangeActiveTextEditor(editor => {
            activeEditor = editor;
            if (editor) {
                this.updateDecorations(vscode.window.activeTextEditor, this.config);
            }
        }));
        this.listeners.push(vscode.workspace.onDidChangeTextDocument(event => {
            if (activeEditor && event.document === activeEditor.document) {
                this.updateDecorations(vscode.window.activeTextEditor, this.config);
            }
        }));
    }
    unregisterListeners() {
        this.listeners.forEach(p => p.dispose());
        this.listeners = [];
    }
    updateDecorations(activeEditor, config) {
        if (!activeEditor) {
            return;
        }
        const regEx = config.expression;
        const text = activeEditor.document.getText();
        const commentTypes = [];
        const contents = [];
        let match;
        while (match = regEx.exec(text)) {
            const startPos = activeEditor.document.positionAt(match.index + match[0].indexOf(match[1]));
            const endPos = startPos.translate(0, match[1].length);
            const decoration = { range: new vscode.Range(startPos, endPos) };
            commentTypes.push(decoration);
            const content = match[match.length - 1];
            const contentStartPos = activeEditor.document.positionAt(match.index + match[0].indexOf(content));
            const contentEndPos = contentStartPos.translate(0, content.length);
            contents.push({ range: new vscode.Range(contentStartPos, contentEndPos) });
        }
        activeEditor.setDecorations(this.commentTypeStyle, commentTypes);
        activeEditor.setDecorations(this.commentContentStyle, contents);
    }
}
exports.Deocrator = Deocrator;
//# sourceMappingURL=decorator.js.map