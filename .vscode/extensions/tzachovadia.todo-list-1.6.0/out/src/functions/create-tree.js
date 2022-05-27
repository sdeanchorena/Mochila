"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const fs_1 = require("fs");
const action_comment_1 = require("../models/action-comment");
const consts_1 = require("../consts");
function createTree(comments) {
    const actions = {};
    Object.keys(comments)
        .map(filename => comments[filename].forEach(actionComment => {
        if (!actions[actionComment.commentType]) {
            actions[actionComment.commentType] = [];
        }
        actionComment.uri = actionComment.uri;
        actionComment.command = new OpenFileCommand(actionComment.uri, actionComment.position);
        actionComment.type = 'Value';
        actionComment.contextValue = '$Comment';
        actionComment.iconPath = {
            light: getIconPath(actionComment.commentType, 'light'),
            dark: getIconPath(actionComment.commentType, 'dark')
        };
        actions[actionComment.commentType].push(actionComment);
    }));
    const topLevel = Object.keys(actions)
        .map(action => {
        const topLevelAction = new action_comment_1.ActionComment(action, vscode.TreeItemCollapsibleState.Expanded, '$GROUP');
        topLevelAction.tooltip = consts_1.tooltips[action.toUpperCase()] || null;
        return topLevelAction;
    });
    return { items: topLevel, actions };
}
exports.createTree = createTree;
class OpenFileCommand {
    constructor(uri, position) {
        this.command = 'extension.openFile';
        this.title = 'Open File';
        this.arguments = [uri, position];
    }
}
function getIconPath(type, theme) {
    const iconPath = path.join(__filename, '..', '..', '..', '..', 'icons', theme, type.toLowerCase() + '.svg');
    if (fs_1.existsSync(iconPath)) {
        return iconPath;
    }
    return path.join(__filename, '..', '..', '..', '..', 'icons', theme, 'todo.svg');
}
//# sourceMappingURL=create-tree.js.map