'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const register_tree_1 = require("./functions/register-tree");
const uri_handler_1 = require("./modules/uri-handler");
const trello_1 = require("./modules/trello");
const modifications_1 = require("./modules/modifications");
const decorator_1 = require("./modules/decorator");
const gmail_1 = require("./modules/gmail");
const telemetry_1 = require("./modules/telemetry");
const github_1 = require("./modules/github");
const code_actions_1 = require("./modules/code-actions");
async function activate(context) {
    try {
        let config = getConfig();
        const tree = register_tree_1.registerTreeViewProvider(context, config);
        context.subscriptions.push(vscode.window.registerUriHandler(new uri_handler_1.TodoUriHandler()));
        await setupTelemetry(config);
        const trello = new trello_1.Trello(context, config);
        const modifications = new modifications_1.Modifications(context, config);
        const decorator = new decorator_1.Deocrator(context, config);
        const gmail = new gmail_1.Gmail(context, config);
        const codeActions = new code_actions_1.CodeActions(context, config);
        const gitHub = new github_1.GitHub(context, config);
        context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
            config = getConfig();
            if (e.affectsConfiguration('trello')) {
                trello.updateConfiguration(config);
            }
            if (e.affectsConfiguration('name')) {
                modifications.updateConfiguration(config);
            }
            if (e.affectsConfiguration('expression') || e.affectsConfiguration('enableCommentFormatting')) {
                decorator.updateConfiguration(config);
            }
            if (e.affectsConfiguration('enableTelemetry')) {
                telemetry_1.Telemetry.updateConfiguration(config);
            }
            if (e.affectsConfiguration('expression') || e.affectsConfiguration('enabledCodeActions')) {
                codeActions.updateConfiguration(config);
            }
            if (e.affectsConfiguration('expression') || e.affectsConfiguration('include') || e.affectsConfiguration('exclude')) {
                tree.updateConfiguration(config);
            }
            if (e.affectsConfiguration('github')) {
                gitHub.updateConfiguration(config);
            }
        }));
    }
    catch (e) {
        vscode.window.showErrorMessage('Could not activate TODO List (' + e.message + ')');
    }
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
async function setupTelemetry(config) {
    if (config.enableTelemetry === null) {
        const message = 'Enable minimal telemetry? This will let us know which features are more useful so we could make them better - No personal or project data will be sent';
        const enableAction = 'Yes';
        const cancelAction = 'No';
        const userResponse = await vscode.window.showInformationMessage(message, enableAction, cancelAction);
        const enableTelemetry = userResponse === enableAction ? true : false;
        vscode.workspace.getConfiguration().update('enableTelemetry', enableTelemetry, vscode.ConfigurationTarget.Global);
        config.enableTelemetry = enableTelemetry;
    }
    telemetry_1.Telemetry.init(config);
    telemetry_1.Telemetry.trackLoad();
}
function getConfig() {
    const appScheme = vscode.version.indexOf('insider') > -1 ? 'vscode-insiders' : 'vscode';
    const configuration = vscode.workspace.getConfiguration();
    const config = {
        expression: new RegExp(configuration.get('expression'), 'gm'),
        exclude: configuration.get('exclude'),
        include: configuration.get('include'),
        scanOnSave: configuration.get('scanOnSave'),
        name: configuration.get('name'),
        trello: configuration.get('trello'),
        scheme: appScheme,
        enableCommentFormatting: configuration.get('enableCommentFormatting'),
        enableTelemetry: configuration.get('enableTelemetry', null),
        actionTypes: configuration.get('actionTypes').toUpperCase().trim().split(','),
        github: configuration.get('github'),
        enabledCodeActions: configuration.get('enabledCodeActions')
    };
    return config;
}
//# sourceMappingURL=extension.js.map