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
const https = require("https");
const clipboardy = require('clipboardy');
const action_comment_1 = require("../models/action-comment");
const telemetry_1 = require("./telemetry");
const register_command_1 = require("../functions/register-command");
class Trello {
    constructor(context, config) {
        this.config = config;
        register_command_1.registerCommand(context, 'extension.createTrelloCard', this.createTrelloCard.bind(this));
    }
    updateConfiguration(config) {
        this.config = config;
    }
    async createTrelloCard(item) {
        const name = `${item.commentType}: ${item.label}`;
        const desc = `[View File](${this.config.scheme}://TzachOvadia.todo-list/view?file=${encodeURIComponent(item.uri.fsPath)}#${item.position})`;
        let key = 'a20752c7ff035d5001ce2938f298be64';
        let token = this.config.trello.token;
        let listId = this.config.trello.defaultList;
        if (!token) {
            try {
                token = await this.getToken(key);
                vscode.workspace.getConfiguration('trello').update('token', token, vscode.ConfigurationTarget.Global);
            }
            catch (e) {
                return;
            }
        }
        if (!listId) {
            const list = await this.selectTrelloList(key, token);
            if (!list) {
                return;
            }
            listId = list.id;
            vscode.workspace.getConfiguration('trello').update('defaultList', listId, vscode.ConfigurationTarget.Global);
        }
        const addCardResult = await this.addTrelloCard(listId, name, desc, key, token);
    }
    async selectTrelloList(key, token) {
        try {
            const boards = await this.getTrelloBoards(key, token);
            if (!boards) {
                return;
            }
            const selectedBoard = await vscode.window.showQuickPick(boards.map(p => (Object.assign({}, p, { label: p.name }))), { placeHolder: 'Select Trello Board' });
            if (!selectedBoard) {
                return;
            }
            const lists = await this.getTrelloLists(selectedBoard.id, key, token);
            if (!lists) {
                return;
            }
            const selectedList = await vscode.window.showQuickPick(lists.map(p => (Object.assign({}, p, { label: p.name }))), { placeHolder: 'Select List' });
            return selectedList;
        }
        catch (e) {
            console.error(e);
            return;
        }
    }
    getToken(key) {
        return new Promise(async (resolve, reject) => {
            let token = await vscode.window.showInputBox({ prompt: 'Trello Token', ignoreFocusOut: true });
            if (!!token) {
                return resolve(token);
            }
            const genToken = await vscode.window.showInformationMessage('Trello token is required in order to create new cards. Click `Generate` to open authorization page.', { modal: false }, { title: 'Generate' });
            if (!genToken) {
                return reject();
            }
            const listener = vscode.window.onDidChangeWindowState(async (e) => {
                if (e.focused) {
                    const value = await clipboardy.read();
                    token = await vscode.window.showInputBox({ prompt: 'Trello Token', ignoreFocusOut: true, value: value });
                    listener.dispose();
                    if (!!token) {
                        return resolve(token);
                    }
                }
            });
            await vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(`https://trello.com/1/authorize?name=TODO%20List&scope=read,write&expiration=never&response_type=token&key=${key}`));
        });
    }
    getTrelloBoards(key, token) {
        return httpGet(`https://api.trello.com/1/members/me/boards?key=${key}&token=${token}`);
    }
    getTrelloLists(boardId, key, token) {
        return httpGet(`https://api.trello.com/1/boards/${boardId}/lists?key=${key}&token=${token}`);
    }
    addTrelloCard(listId, name, desc, key, token) {
        return httpPost(`/1/cards?idList=${listId}&name=${encodeURIComponent(name)}&desc=${encodeURIComponent(desc)}&keepFromSource=all&key=${key}&token=${token}`);
    }
}
__decorate([
    telemetry_1.TrackFeature('CreateCard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [action_comment_1.ActionComment]),
    __metadata("design:returntype", Promise)
], Trello.prototype, "createTrelloCard", null);
exports.Trello = Trello;
function httpGet(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData);
                    resolve(parsedData);
                }
                catch (e) {
                    reject(e);
                }
            });
        }).on('error', (e) => reject(e));
    });
}
function httpPost(urlPath) {
    return new Promise((resolve, reject) => {
        const postData = '';
        const options = {
            hostname: 'api.trello.com',
            port: 443,
            path: urlPath,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        const req = https.request(options, (res) => {
            res.setEncoding('utf8');
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(data);
            });
        });
        req.on('error', (e) => {
            reject(e);
        });
        // write data to request body
        req.write(postData);
        req.end();
    });
}
//# sourceMappingURL=trello.js.map