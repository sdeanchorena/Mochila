"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
// export interface ActionComment {
//     text: string;
//     position: number;
//     commentType: string;
//     uri: vscode.Uri;
// }
class ActionComment extends vscode.TreeItem {
    constructor(label, collapsibleState, contextValue = '') {
        super(label, collapsibleState);
        this.contextValue = '';
        this.contextValue = contextValue;
    }
}
exports.ActionComment = ActionComment;
//# sourceMappingURL=action-comment.js.map