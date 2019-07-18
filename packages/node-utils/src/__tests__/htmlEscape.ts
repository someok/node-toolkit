import htmlEscape from '../htmlEscape';

test('escaping', (): void => {
    expect(htmlEscape()).toBe('');
    expect(htmlEscape('no escape')).toBe('no escape');
    expect(htmlEscape('foo&bar')).toBe('foo&amp;bar');
    expect(htmlEscape('<tag>')).toBe('&lt;tag>');
    expect(htmlEscape("test='foo'")).toBe('test=&apos;foo&apos;');
    expect(htmlEscape('test="foo"')).toBe('test=&quot;foo&quot;');
    expect(htmlEscape('<ta\'&g">')).toBe('&lt;ta&apos;&amp;g&quot;>');
    expect(htmlEscape('中文<321>中文')).toBe('中文&lt;321>中文');
});
