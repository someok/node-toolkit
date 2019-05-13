const path = require('path');
const marked = require('marked');
const _ = require('lodash');
const Node = require('../TxtNode');

function lexer2Json(tokens) {
    const rootNode = new Node('__ROOT__');

    let pNode;
    let cNode;
    let ignore = false;
    tokens.forEach(token => {
        const {type} = token;
        if (type.includes('start') && !type.includes('list')) {
            ignore = true;
        }
        if (type.includes('end') && !type.includes('list')) {
            ignore = false;
        }
        if (ignore) {
            return;
        }

        if (type === 'list_start') {
            if (!cNode) {
                pNode = rootNode;
            } else {
                pNode = cNode;
            }
        }
        if (type === 'list_item_start') {
            cNode = new Node();
            cNode.parent = pNode;
            pNode.children.push(cNode);
        }
        if (type === 'text') {
            const txt = token.text.trim();
            cNode.title = Node.validTitle(path.basename(txt));
            cNode.rawTitle = txt;
            cNode.ext = path.extname(txt);
        }
        if (type === 'list_item_end') {
        }
        if (type === 'list_end') {
            pNode = pNode.parent;
        }
    });

    return rootNode.children;
}

function parser(mdContent) {
    if (typeof mdContent !== 'string') throw new Error('不是有效 markdown list 字符串');
    if (!mdContent) return null;

    const content = mdContent.trim();
    if (!content) return null;

    const tokens = marked.lexer(content);
    if (_.isEmpty(tokens)) return null;

    // console.log(tokens);

    return lexer2Json(tokens);
}

module.exports = parser;
