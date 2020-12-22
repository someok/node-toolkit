import {splitByBracket, escapeWindowsFilename} from '../stringUtils';

test('splitByBracket', () => {
    let str = '[aaa][bbb]c[cc]ccc[ddd][eee]';
    let arr = splitByBracket(str);
    expect(arr.length).toBe(7);
    expect(arr[0]).toEqual({isBracket: true, text: '[aaa]'});
    expect(arr[1]).toEqual({isBracket: true, text: '[bbb]'});
    expect(arr[2]).toEqual({isBracket: false, text: 'c'});
    expect(arr[3]).toEqual({isBracket: true, text: '[cc]'});
    expect(arr[4]).toEqual({isBracket: false, text: 'ccc'});
    expect(arr[5]).toEqual({isBracket: true, text: '[ddd]'});
    expect(arr[6]).toEqual({isBracket: true, text: '[eee]'});

    str = '[123[aaa]（bbb)c(ccccc[ddd][eee]fff(ggg[hhh]iii)jjj]';
    arr = splitByBracket(str);
    // console.log(str);
    // console.log(arr);
    expect(arr[0]).toEqual({isBracket: false, text: '[123'});
    expect(arr[1]).toEqual({isBracket: true, text: '[aaa]'});
    expect(arr[2]).toEqual({isBracket: true, text: '(bbb)'});
    expect(arr[3]).toEqual({isBracket: false, text: 'c'});
    expect(arr[4]).toEqual({isBracket: false, text: '(ccccc'});
    expect(arr[5]).toEqual({isBracket: true, text: '[ddd]'});
    expect(arr[6]).toEqual({isBracket: true, text: '[eee]'});
    expect(arr[7]).toEqual({isBracket: false, text: 'fff'});
    expect(arr[8]).toEqual({isBracket: false, text: '(ggg'});
    expect(arr[9]).toEqual({isBracket: true, text: '[hhh]'});
    expect(arr[10]).toEqual({isBracket: false, text: 'iii'});
    expect(arr[11]).toEqual({isBracket: false, text: ')'});
    expect(arr[12]).toEqual({isBracket: false, text: 'jjj'});
    expect(arr[13]).toEqual({isBracket: false, text: ']'});

    // console.log(splitByBracket('[aaa][bbb]ccc[ddd][eee][fff(ggg)hhh)iii]'));
});

test('escapeWindowsFilename', () => {
    expect(escapeWindowsFilename('')).toBe('');
    expect(escapeWindowsFilename('a/\\!:*b?c<d>e|f"g')).toBe('abcdefg');
    expect(escapeWindowsFilename('这/是\\中!文:*b?c<d>e|f"g')).toBe('这是中文bcdefg');
});
