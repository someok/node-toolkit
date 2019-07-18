import path from 'path';
import marked from 'marked';
import _ from 'lodash';

import TxtNode from '../TxtNode';

type Tokens =
    | marked.Tokens.ListStart
    | marked.Tokens.ListEnd
    | marked.Tokens.ListItemStart
    | marked.Tokens.ListItemEnd
    | marked.Tokens.Text;

function lexer2Json(tokens: Tokens[] | marked.TokensList): TxtNode[] {
    const rootNode = new TxtNode('__ROOT__');

    let pNode: TxtNode | undefined;
    let cNode: TxtNode;
    let ignore = false;
    tokens.forEach((token): void => {
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
            cNode = new TxtNode();
            cNode.parent = pNode;
            if (pNode != null && pNode.children) pNode.children.push(cNode);
        }
        if (token.type === 'text') {
            const txt = token.text.trim();
            cNode.ext = path.extname(txt);
            cNode.title = path.basename(txt);
            cNode.rawTitle = txt;
        }
        if (type === 'list_item_end') {
        }
        if (type === 'list_end') {
            if (pNode) pNode = pNode.parent;
        }
    });

    return rootNode.children;
}

export default function parser(mdContent: string): TxtNode[] | null {
    if (!mdContent) return null;

    const content = mdContent.trim();
    if (!content) return null;

    const tokens: marked.TokensList = marked.lexer(content);
    if (_.isEmpty(tokens)) return null;

    // console.log(tokens);

    return lexer2Json(tokens);
}
