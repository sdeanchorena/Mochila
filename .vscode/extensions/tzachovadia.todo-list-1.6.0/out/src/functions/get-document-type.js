"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getDocumentType(fsPath) {
    return (/\.([\w]+)$/.exec(fsPath) || [null]).pop();
}
exports.getDocumentType = getDocumentType;
//# sourceMappingURL=get-document-type.js.map