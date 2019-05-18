import {getAuthor, getTitle} from '../titleUtils';

test('getTitle', () => {
    let name = '这是一个标题作者：随便';
    let title = getTitle(name);
    // console.log(title);
    expect(title).toBe('这是一个标题');

    name = '作者 xxx';
    title = getTitle(name);
    expect(title).toBe(name);

    name = '标题';
    title = getTitle(name);
    expect(title).toBe(name);
});

test('getAuthor', () => {
    let name = '标题[作者：张三]';
    let author = getAuthor(name);
    expect(author).toBe('张三');

    name = '标题[作者&续写：张三]';
    author = getAuthor(name);
    expect(author).toBe('张三');

    name = '标题[作者&续写：张三】';
    author = getAuthor(name);
    // console.log(author);
    expect(author).toBe('张三');

    name = '标题';
    author = getAuthor(name);
    expect(author).toBeUndefined();

    name = '标题作者:  ';
    author = getAuthor(name);
    expect(author).toBeUndefined();
});
