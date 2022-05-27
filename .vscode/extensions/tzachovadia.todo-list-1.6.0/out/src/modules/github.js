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
const parse = require('parse-git-config');
const action_comment_1 = require("../models/action-comment");
const telemetry_1 = require("./telemetry");
const register_command_1 = require("../functions/register-command");
const base_1 = require("./base");
const utils_1 = require("../functions/utils");
class GitHub extends base_1.BaseModule {
    constructor(context, config) {
        super(config);
        register_command_1.registerCommand(context, 'extension.createGitHubIssue', this.createGitHubIssue.bind(this));
    }
    onConfigChange() {
        if (this.config.github && !this.config.github.storeCredentials && !!this.config.github.auth) {
            vscode.workspace.getConfiguration('github').update('auth', null, vscode.ConfigurationTarget.Global);
        }
    }
    async createGitHubIssue(item) {
        const credentials = await this.getAuth();
        if (!credentials) {
            return;
        }
        const commentSnippet = await utils_1.getSnippetMarkdown(item.uri, item.position, 5);
        const title = `${item.commentType}: ${item.label}`;
        const body = commentSnippet;
        const repoPath = this.getRepositoryPath();
        const response = await utils_1.httpPost(`api.github.com`, `/repos/${repoPath}/issues`, { title, body }, {
            'Authorization': `Basic ${credentials}`
        });
        if (response) {
            try {
                const result = JSON.parse(response);
                if (result.html_url) {
                    const userAction = await vscode.window.showInformationMessage(`GitHub issue created!\nURL: ${result.html_url}`, 'Open');
                    if (userAction === 'Open') {
                        return vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(result.html_url));
                    }
                }
                console.log(result);
            }
            catch (e) {
                vscode.window.showErrorMessage(`There was a problem creating GitHub issue\n${e.message}`);
            }
        }
    }
    getRepositoryPath() {
        const cwd = vscode.workspace.workspaceFolders[0].uri.fsPath;
        const gitConfig = parse.sync({ cwd, path: '.git/config' });
        const keys = parse.expandKeys(gitConfig);
        const noProto = keys.remote.origin.url.substr(keys.remote.origin.url.indexOf('//') + 2);
        return noProto.substr(noProto.indexOf('/') + 1).replace('.git', '');
    }
    async getAuth() {
        const Cryptr = require('cryptr');
        const sk = `${vscode.env.appName}:${vscode.env.machineId}`;
        const cryptr = new Cryptr(sk);
        let encryptedCredentials = this.config.github && this.config.github.auth && this.config.github.storeCredentials ? this.config.github.auth : null;
        if (!!encryptedCredentials) {
            console.log(encryptedCredentials);
            return cryptr.decrypt(encryptedCredentials);
        }
        const username = await vscode.window.showInputBox({ prompt: 'GitHub Username' });
        if (!username) {
            return;
        }
        const password = await vscode.window.showInputBox({ prompt: 'GitHub Password', password: true });
        if (!password) {
            return;
        }
        const credentials = Buffer.from(`${username}:${password}`).toString('base64');
        if (this.config.github && this.config.github.storeCredentials) {
            const encryptedString = cryptr.encrypt(credentials);
            vscode.workspace.getConfiguration('github').update('auth', encryptedString, vscode.ConfigurationTarget.Global);
        }
        return credentials;
    }
}
__decorate([
    telemetry_1.TrackFeature('Create GitHub Issue'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [action_comment_1.ActionComment]),
    __metadata("design:returntype", Promise)
], GitHub.prototype, "createGitHubIssue", null);
exports.GitHub = GitHub;
//# sourceMappingURL=github.js.map