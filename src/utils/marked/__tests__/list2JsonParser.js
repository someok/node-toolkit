const fs = require('fs');
const path = require('path');
const parser = require('../list2JsonParser');

function loadMd(path) {
    const buf = fs.readFileSync(path);
    return buf.toString();
}

test('parse simple md', () => {
    const dir = path.resolve(__dirname, 'md-files', 'simple.md');
    console.log(dir);
    const md = loadMd(dir);
    console.log('===' + md + '===');

    const nodeTree = parser(md);
    console.log(nodeTree);

    expect(nodeTree.length).toBe(4);
    expect(nodeTree[0].title).toBe('aa');
    expect(nodeTree[0].children.length).toBe(0);

    expect(nodeTree[1].children.length).toBe(2);
    expect(nodeTree[1].children[0].title).toBe('cc');
    expect(nodeTree[1].children[1].title).toBe('dd');

    expect(nodeTree[2].title).toBe('ee');
    expect(nodeTree[2].children.length).toBe(1);
    expect(nodeTree[2].children[0].title).toBe('ff');

    expect(nodeTree[3].title).toBe('gg');
    expect(nodeTree[3].children.length).toBe(1);
    expect(nodeTree[3].children[0].title).toBe('hh');
    expect(nodeTree[3].children[0].children.length).toBe(2);
    expect(nodeTree[3].children[0].children[0].title).toBe('ii');
    expect(nodeTree[3].children[0].children[0].children.length).toBe(1);
    expect(nodeTree[3].children[0].children[0].children[0].title).toBe('jj');
    expect(nodeTree[3].children[0].children[1].title).toBe('kk');
});

test('parse tab and space mix md', () => {
    const dir = path.resolve(__dirname, 'md-files', 'tab-space-mix.md');
    console.log(dir);
    const md = loadMd(dir);
    console.log('===' + md + '===');

    const nodeTree = parser(md);
    console.log(nodeTree);

    expect(nodeTree.length).toBe(4);
    expect(nodeTree[0].title).toBe('aa');
    expect(nodeTree[0].children.length).toBe(0);

    console.log(nodeTree[1].children);
    expect(nodeTree[1].children[0].children[0].title).toBe('tab01');
    // tab02 行是前置 3 个空格 + 1 个 tab
    expect(nodeTree[1].children[1].children[0].title).toBe('tab02');
    expect(nodeTree[1].children[1].children[0].children[0].title).toBe('tab03');
});

test('parse complex list to json', () => {
    const dir = path.resolve(__dirname, 'md-files', 'complex.md');
    console.log(dir);
    const md = loadMd(dir);
    console.log('===' + md + '===');

    const nodeTree = parser(md);
    console.log(nodeTree);
    expect(nodeTree.length).toBe(3);
    expect(nodeTree[0].children.length).toBe(2);
    expect(nodeTree[0].children[0].children.length).toBe(2);
    expect(nodeTree[0].children[0].children[1].children.length).toBe(2);

    expect(nodeTree[0].title).toBe('00');
    expect(nodeTree[0].children[0].title).toBe('10');
    expect(nodeTree[0].children[1].title).toBe('11');
    expect(nodeTree[0].children[0].children[1].children[0].title).toBe('30');
    expect(nodeTree[0].children[0].children[1].children[1].title).toBe('40');
    expect(nodeTree[1].title).toBe('01');
    expect(nodeTree[2].title).toBe('02');
});