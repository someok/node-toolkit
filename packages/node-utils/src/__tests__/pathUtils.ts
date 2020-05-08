import {getAbsolutePath, getUserHome} from '../pathUtils';

test('getAbsolutePath', (): void => {
    const home = getUserHome();
    let dir = getAbsolutePath('~/a/b/c');
    // console.log(dir);

    expect(dir).toBe(`${home}/a/b/c`);

    dir = getAbsolutePath('/a/b/c');
    expect(dir).toBe(`/a/b/c`);

    expect((): void => {
        getAbsolutePath('');
    }).toThrowError('parameter [dir] not define');
});
