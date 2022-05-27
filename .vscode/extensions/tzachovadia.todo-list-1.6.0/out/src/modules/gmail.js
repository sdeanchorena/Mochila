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
const action_comment_1 = require("../models/action-comment");
const telemetry_1 = require("./telemetry");
const register_command_1 = require("../functions/register-command");
const utils_1 = require("../functions/utils");
class Gmail {
    constructor(context, config) {
        this.config = config;
        register_command_1.registerCommand(context, 'extension.sendUsingGmail', this.sendUsingGmail.bind(this));
    }
    async sendUsingGmail(comment) {
        const body = await utils_1.getSnippetPlainText(comment.uri, comment.position, 5);
        const content = encodeURI(body.replace(/ /g, '+'));
        const url = `https://mail.google.com/mail/?view=cm&fs=1&su=${comment.label}&body=${content}`;
        return vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(url));
    }
}
__decorate([
    telemetry_1.TrackFeature('Send'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [action_comment_1.ActionComment]),
    __metadata("design:returntype", Promise)
], Gmail.prototype, "sendUsingGmail", null);
exports.Gmail = Gmail;
//# sourceMappingURL=gmail.js.map