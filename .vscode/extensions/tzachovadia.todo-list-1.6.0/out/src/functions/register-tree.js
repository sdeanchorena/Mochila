"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const tree_provider_1 = require("../tree-provider");
const open_resource_1 = require("./open-resource");
const action_comment_1 = require("../models/action-comment");
const telemetry_1 = require("../modules/telemetry");
const register_command_1 = require("./register-command");
function registerTreeViewProvider(context, config) {
    const actionCommentTreeViewProvider = new tree_provider_1.ActionCommentTreeViewProvider(config);
    const treeActions = new TreeActions(actionCommentTreeViewProvider);
    register_command_1.registerCommand(context, 'extension.openFile', treeActions.openFile.bind(this));
    register_command_1.registerCommand(context, 'extension.viewComment', treeActions.viewComment.bind(this));
    register_command_1.registerCommand(context, 'extension.refreshActionComments', treeActions.refreshActionComments.bind(treeActions));
    register_command_1.registerCommand(context, 'extension.removeActionComment', treeActions.removeActionComment.bind(treeActions));
    register_command_1.registerCommand(context, 'extension.collapseAll', treeActions.collapseAll.bind(treeActions));
    context.subscriptions.push(vscode.window.registerTreeDataProvider('actionComments', actionCommentTreeViewProvider));
    return actionCommentTreeViewProvider;
}
exports.registerTreeViewProvider = registerTreeViewProvider;
class TreeActions {
    constructor(provider) {
        this.provider = provider;
    }
    openFile(uri, position) {
        return open_resource_1.openResource(uri, position);
    }
    viewComment(item) {
        return open_resource_1.openResource(item.uri, item.position);
    }
    refreshActionComments() {
        return this.provider.refresh(true);
    }
    removeActionComment(item) {
        return this.provider.removeItem(item.uri, item.position, item.length);
    }
    collapseAll() {
        this.provider.collapseAll();
    }
}
__decorate([
    telemetry_1.TrackFeature('OpenFile'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TreeActions.prototype, "openFile", null);
__decorate([
    telemetry_1.TrackFeature('ViewComment'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [action_comment_1.ActionComment]),
    __metadata("design:returntype", void 0)
], TreeActions.prototype, "viewComment", null);
__decorate([
    telemetry_1.TrackFeature('Refresh'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TreeActions.prototype, "refreshActionComments", null);
__decorate([
    telemetry_1.TrackFeature('Remove'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [action_comment_1.ActionComment]),
    __metadata("design:returntype", void 0)
], TreeActions.prototype, "removeActionComment", null);
__decorate([
    telemetry_1.TrackFeature('Collapse'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TreeActions.prototype, "collapseAll", null);
//# sourceMappingURL=register-tree.js.map