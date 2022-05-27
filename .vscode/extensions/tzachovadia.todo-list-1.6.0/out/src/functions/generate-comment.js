"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateComment(item, documentType = '') {
    switch (documentType.toLowerCase()) {
        case 'html':
            return `<!-- ${item.commentType.toUpperCase()}${!!item.createdBy ? '(' + item.createdBy + ')' : ''}: ${item.label} -->`;
        case 'css':
            return `/* ${item.commentType.toUpperCase()}${!!item.createdBy ? '(' + item.createdBy + ')' : ''}: ${item.label} */`;
        default:
            return `// ${item.commentType.toUpperCase()}${!!item.createdBy ? '(' + item.createdBy + ')' : ''}: ${item.label}`;
    }
}
exports.generateComment = generateComment;
//# sourceMappingURL=generate-comment.js.map