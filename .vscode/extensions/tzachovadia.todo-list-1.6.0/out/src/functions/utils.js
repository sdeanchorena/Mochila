"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const https = require("https");
async function getSnippet(resource, startAt, numberOfLines) {
    const editor = await vscode.window.showTextDocument(resource);
    const pos = editor.document.positionAt(startAt);
    const startLine = Math.max(pos.line - 2, 0);
    const endLine = Math.min(editor.document.lineCount, pos.line + numberOfLines);
    let content = editor.document.getText(new vscode.Range(startLine, 0, endLine, 0));
    content = content.trim();
    const file = `${resource.fsPath}:${pos.line + 1}:${(pos.character || 0) + 1}`;
    return {
        snippet: content,
        filename: file
    };
}
exports.getSnippet = getSnippet;
async function getSnippetMarkdown(resource, startAt, numberOfLines) {
    const snippet = await getSnippet(resource, startAt, numberOfLines);
    const lang = vscode.window.activeTextEditor.document.languageId;
    return `\`\`\`${lang}\n${snippet.snippet}\n\`\`\`\n---\n${snippet.filename}`;
}
exports.getSnippetMarkdown = getSnippetMarkdown;
async function getSnippetPlainText(resource, startAt, numberOfLines) {
    const snippet = await getSnippet(resource, startAt, numberOfLines);
    const line = '-'.repeat(snippet.filename.length);
    return `${line}\n${snippet.snippet}\n${line}\n${snippet.filename}`;
}
exports.getSnippetPlainText = getSnippetPlainText;
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
exports.httpGet = httpGet;
function httpPost(hostname, urlPath, data, headers) {
    return new Promise((resolve, reject) => {
        data = JSON.stringify(data);
        const options = {
            hostname: hostname,
            port: 443,
            path: urlPath,
            method: 'POST',
            headers: Object.assign({ 'User-Agent': 'VSCode TODO List Extension', 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }, headers)
        };
        const req = https.request(options, (res) => {
            res.setEncoding('utf8');
            let rData = '';
            res.on('data', (chunk) => {
                rData += chunk;
            });
            res.on('end', () => {
                resolve(rData);
            });
        });
        req.on('error', (e) => {
            reject(e);
        });
        // write data to request body
        req.write(data);
        req.end();
    });
}
exports.httpPost = httpPost;
//# sourceMappingURL=utils.js.map