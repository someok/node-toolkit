import cheerio from 'cheerio';
import _ from 'lodash';

test('remove html element', () => {
    const html = `
<div>
    <div class="post-title">
        <h1>
            <span class="manga-title-badges hot">HOT</span>
            <span class="manga-title-badges hot">HOT</span>
            hello world
        </h1>
    </div>
</div>
    `;
    const $ = cheerio.load(html);
    const el = $('.post-title > h1');
    el.find('span').remove();

    const text = el.text().trim();
    expect(text).toBe('hello world');
});
