import {splitByBracket} from '../stringUtils';

test('splitByBracket', () => {
    const str = '[aaa][bbb]c[cc]ccc[ddd][eee]';
    const arr = splitByBracket(str);
    expect(arr.length).toBe(7);
    expect(arr[0]).toEqual({isBracket: true, text: '[aaa]'});
    expect(arr[1]).toEqual({isBracket: true, text: '[bbb]'});
    expect(arr[2]).toEqual({isBracket: false, text: 'c'});
    expect(arr[3]).toEqual({isBracket: true, text: '[cc]'});
    expect(arr[4]).toEqual({isBracket: false, text: 'ccc'});
    expect(arr[5]).toEqual({isBracket: true, text: '[ddd]'});
    expect(arr[6]).toEqual({isBracket: true, text: '[eee]'});
});
