"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const read_comments_1 = require("./functions/read-comments");
const remove_comment_1 = require("./functions/remove-comment");
const create_tree_1 = require("./functions/create-tree");
class ActionCommentTreeViewProvider {
    constructor(config) {
        this.config = config;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        vscode.workspace.onDidSaveTextDocument((document) => {
            if (config.scanOnSave) {
                this.refresh(true, document.uri);
            }
        });
        this.refresh(true);
    }
    async updateConfiguration(config) {
        this.config = config;
        try {
            await this.refresh(true);
        }
        catch (e) {
            console.error('Could not refresh tree after config change', e);
        }
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (this.tree && element) {
            return Promise.resolve(this.tree[element.label]);
        }
        if (!!this.comments) {
            const tree = create_tree_1.createTree(this.comments);
            return tree.items;
        }
        return [];
    }
    getParent(element) {
        return null;
    }
    async refresh(emitChange, file) {
        try {
            if (file) {
                const fileComments = await read_comments_1.readCommentsInFile(this.config.expression, file);
                const key = vscode.workspace.asRelativePath(file, true);
                if (!!fileComments) {
                    this.comments[key] = fileComments;
                }
                else {
                    if (key in this.comments) {
                        delete this.comments[key];
                    }
                }
            }
            else {
                this.comments = await read_comments_1.readComments(this.config);
            }
            const tree = create_tree_1.createTree(this.comments);
            this.tree = tree.actions;
            if (emitChange) {
                this._onDidChangeTreeData.fire();
            }
            return Promise.resolve(tree.items);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    async removeItem(resource, start, length) {
        await remove_comment_1.removeComment(resource, start, length);
        this.refresh(true, resource);
    }
    collapseAll() {
        // TODO: implement
        this.refresh(false);
    }
}
exports.ActionCommentTreeViewProvider = ActionCommentTreeViewProvider;
//# sourceMappingURL=tree-provider.js.map