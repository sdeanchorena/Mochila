"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs_1 = require("fs");
const action_comment_1 = require("../models/action-comment");
async function readComments(config) {
    try {
        const files = await vscode.workspace.findFiles(config.include, config.exclude);
        const result = await createObject(config.expression, files);
        return Promise.resolve(result);
    }
    catch (err) {
        return Promise.reject(err);
    }
}
exports.readComments = readComments;
async function createObject(expression, files) {
    const result = {};
    for (const file of files) {
        const key = vscode.workspace.asRelativePath(file, true);
        const comments = await readCommentsInFile(expression, file);
        if (!!comments) {
            result[key] = comments;
        }
    }
    return result;
}
async function readCommentsInFile(expression, file) {
    let fileContent;
    try {
        fileContent = await fs_1.promises.readFile(file.fsPath, 'utf8');
    }
    catch (e) {
        console.warn(`readCommentsInFile() readFile failed (${file.fsPath})`, e);
        return null;
    }
    const hasBOM = /^\uFEFF/.test(fileContent);
    let res;
    const currentFileActions = [];
    while (res = expression.exec(fileContent)) {
        const groups = {
            type: res[1],
            name: res[2],
            text: res[res.length - 1]
        };
        if (res.length < 4) {
            groups.name = null;
        }
        const label = groups.text.replace(/[ ]?\*\/$/, '');
        const commentType = (groups.type || 'TODO').toUpperCase();
        const comment = new action_comment_1.ActionComment(label);
        const tooltip = [];
        if (groups.name) {
            tooltip.push(`Created by ${groups.name}`);
            comment.createdBy = groups.name;
        }
        tooltip.push(file.fsPath);
        let position = expression.lastIndex - res[0].length;
        if (hasBOM) {
            position--;
        }
        currentFileActions.push(Object.assign({}, comment, { commentType,
            position, uri: file, type: 'Action', contextValue: commentType, tooltip: tooltip.join('\n'), length: res[0].length, id: `${encodeURIComponent(file.path)}_${expression.lastIndex - res[0].length}` }));
    }
    if (currentFileActions.length > 0) {
        return currentFileActions.sort((a, b) => a.position > b.position ? 1 : ((b.position > a.position) ? -1 : 0));
    }
    return null;
}
exports.readCommentsInFile = readCommentsInFile;
function parseComment(expression, text, file, position) {
    const hasBOM = /^\uFEFF/.test(text);
    const exp = expression.compile(); // HACK: reset expression
    const res = exp.exec(text);
    const groups = {
        type: res[1],
        name: res[2],
        text: res[res.length - 1]
    };
    if (res.length < 4) {
        groups.name = null;
    }
    const label = groups.text.replace(/[ ]?\*\/$/, '');
    const commentType = (groups.type || 'TODO').toUpperCase();
    const comment = new action_comment_1.ActionComment(label);
    const tooltip = [];
    if (groups.name) {
        tooltip.push(`Created by ${groups.name}`);
        comment.createdBy = groups.name;
    }
    tooltip.push(file.fsPath);
    // let position = expression.lastIndex - res[0].length;
    if (hasBOM) {
        position--;
    }
    const id = file ? encodeURIComponent(file.path) + '_' : '' + `${expression.lastIndex - res[0].length}`;
    const uri = file || undefined;
    return Object.assign({}, comment, { commentType,
        position,
        uri, type: 'Action', contextValue: commentType, tooltip: tooltip.join('\n'), length: res[0].length, id });
}
exports.parseComment = parseComment;
//# sourceMappingURL=read-comments.js.map