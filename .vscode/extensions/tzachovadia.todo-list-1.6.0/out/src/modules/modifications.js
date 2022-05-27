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
const micromatch = require('micromatch');
const clipboardy = require('clipboardy');
const action_comment_1 = require("../models/action-comment");
const generate_comment_1 = require("../functions/generate-comment");
const edit_comment_1 = require("../functions/edit-comment");
const insert_comment_1 = require("../functions/insert-comment");
const telemetry_1 = require("./telemetry");
const register_command_1 = require("../functions/register-command");
const consts_1 = require("../consts");
const get_document_type_1 = require("../functions/get-document-type");
class Modifications {
    constructor(context, config) {
        this.config = config;
        register_command_1.registerCommand(context, 'extension.editComment', this.editCommentCommand.bind(this));
        register_command_1.registerCommand(context, 'extension.insertComment', this.insertCommentCommand.bind(this));
        register_command_1.registerCommand(context, 'extension.copyComment', this.copyCommentCommand.bind(this));
    }
    updateConfiguration(config) {
        this.config = config;
    }
    async editCommentCommand(item) {
        item = await this.getUserInputs(item);
        if (!item) {
            return;
        }
        const docType = get_document_type_1.getDocumentType(item.uri.fsPath);
        const newComment = generate_comment_1.generateComment(item, docType);
        edit_comment_1.editComment(item, newComment);
    }
    async insertCommentCommand() {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor || !activeEditor.document) {
            return;
        }
        const extensionSupported = micromatch.isMatch(activeEditor.document.uri.fsPath, this.config.include);
        if (!extensionSupported) {
            return;
        }
        const item = await this.getUserInputs();
        if (!item) {
            return;
        }
        insert_comment_1.insertComment(item);
    }
    async copyCommentCommand(item) {
        const docType = get_document_type_1.getDocumentType(item.uri.fsPath);
        const text = generate_comment_1.generateComment(item, docType);
        await clipboardy.write(text);
    }
    async getUserInputs(item) {
        item = item || new action_comment_1.ActionComment(null);
        const data = [
            { prompt: 'Comment type', value: item && item.commentType, key: 'commentType', options: this.config.actionTypes },
            { prompt: 'Text', value: item && item.label, key: 'label' },
            { prompt: 'Created by', value: (item && item.createdBy) || this.config.name, key: 'createdBy' }
        ];
        for (let i = 0; i < data.length; i++) {
            const input = data[i];
            let newValue;
            if (input.options) {
                const options = input.options.map(o => {
                    const label = o;
                    const description = consts_1.tooltips[o] || null;
                    return { label, description };
                });
                const userSelection = await vscode.window.showQuickPick(options, { placeHolder: input.prompt });
                newValue = userSelection && userSelection.label;
            }
            else {
                newValue = await vscode.window.showInputBox({ prompt: input.prompt, value: input.value });
            }
            if (newValue === undefined) {
                return;
            }
            item[input.key] = newValue;
        }
        return item;
    }
}
__decorate([
    telemetry_1.TrackFeature('Edit'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [action_comment_1.ActionComment]),
    __metadata("design:returntype", Promise)
], Modifications.prototype, "editCommentCommand", null);
__decorate([
    telemetry_1.TrackFeature('Insert'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Modifications.prototype, "insertCommentCommand", null);
__decorate([
    telemetry_1.TrackFeature('Copy'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [action_comment_1.ActionComment]),
    __metadata("design:returntype", Promise)
], Modifications.prototype, "copyCommentCommand", null);
exports.Modifications = Modifications;
//# sourceMappingURL=modifications.js.map