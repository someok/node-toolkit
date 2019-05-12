const TxtNode = require('../TxtNode');

test('should title without txt or md ext', () => {
    let title = '中文 abc123';
    const node = new TxtNode(title + '.tXt');
    console.log(node);
    expect(node.title).toBe(title);

    node.title = title + '.md';
    console.log(node);
    expect(node.title).toBe(title);

    node.title = title + '.tXTmd';
    console.log(node);
    expect(node.title).toBe(title);

    node.title = title + '.MDtxt';
    console.log(node);
    expect(node.title).toBe(title);

    node.title = title + '.MMDtxt';
    console.log(node);
    expect(node.title).toBe(title + '.MMDtxt');

    node.title = title + 'MMDtxt';
    console.log(node);
    expect(node.title).toBe(title + 'MMDtxt');
});
