"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const register_command_1 = require("../functions/register-command");
const read_comments_1 = require("../functions/read-comments");
class CodeActions {
    constructor(context, config) {
        this.context = context;
        this.config = config;
        this.providers = [];
        register_command_1.registerCommand(context, 'extension.contextMenu', this.contextMenuHandler.bind(this));
        if (config.enabledCodeActions) {
            this.setupCodeActions();
        }
    }
    updateConfiguration(config) {
        this.config = config;
        if (config.enabledCodeActions) {
            this.setupCodeActions();
        }
        else {
            this.disableCodeActions();
        }
    }
    setupCodeActions() {
        if (this.providers.length > 0) {
            return;
        }
        const fixProvider = this.createCodeActionProvider();
        this.providers.push(vscode.languages.registerCodeActionsProvider({ scheme: 'file', language: 'typescript' }, fixProvider));
        this.providers.push(vscode.languages.registerCodeActionsProvider({ scheme: 'file', language: 'javascript' }, fixProvider));
        this.context.subscriptions.push(...this.providers);
    }
    disableCodeActions() {
        this.providers.forEach(p => p.dispose());
        this.providers = [];
    }
    createCodeActionProvider() {
        const fixProvider = {
            provideCodeActions: function (document, range, context, token) {
                const codeActionCreator = new CodeActionCreator(document, range, context);
                return [
                    codeActionCreator.create('Create Trello Card', 'extension.createTrelloCard', vscode.CodeActionKind.QuickFix),
                    codeActionCreator.create('Send using Gmail', 'extension.sendUsingGmail', vscode.CodeActionKind.QuickFix)
                ];
            }
        };
        return fixProvider;
    }
    contextMenuHandler(document, range, context, commandName) {
        try {
            const start = new vscode.Position(range.start.line, 0);
            const end = start.translate(1, 0);
            const row = document.getText(range.with(start, end)).trim();
            const c = read_comments_1.parseComment(this.config.expression, row, document.uri, document.offsetAt(start));
            vscode.commands.executeCommand(commandName, c);
        }
        catch (e) {
            console.error('CodeAction Error', e);
        }
    }
}
exports.CodeActions = CodeActions;
class CodeActionCreator {
    constructor(document, range, context) {
        this.document = document;
        this.range = range;
        this.context = context;
    }
    create(title, command, kind) {
        return {
            title,
            kind,
            command: 'extension.contextMenu',
            arguments: [this.document, this.range, this.context, command]
        };
    }
}
//# sourceMappingURL=code-actions.js.map