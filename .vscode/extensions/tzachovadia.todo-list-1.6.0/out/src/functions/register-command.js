"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function registerCommand(context, name, handler) {
    context.subscriptions.push(vscode.commands.registerCommand(name, handler));
}
exports.registerCommand = registerCommand;
//# sourceMappingURL=register-command.js.map