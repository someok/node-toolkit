import Meta from '../Meta';

test('toJson', (): void => {
    const meta = new Meta('title', 'author', 'desc');
    const json = meta.toJson();

    expect(meta.uuid).not.toBeNull();
    expect(json).toEqual({
        title: 'title',
        author: 'author',
        description: 'desc',
        cover: 'cover.jpg',
        autoCover: true,
        uuid: meta.uuid,
        version: '1.0.0',
    });
});

test('fromJson', (): void => {
    let meta = Meta.fromJson(null);
    // console.log(meta);
    expect(meta.title).toBe('');
    expect(meta.author).toBeUndefined();
    expect(meta.description).toBeUndefined();
    expect(meta.cover).toBe('cover.jpg');
    expect(meta.coverFile).toBeUndefined();
    expect(meta.autoCover).toBeTruthy();
    expect(meta.uuid).not.toBeNull();
    expect(meta.version).toBe('1.0.0');

    meta = Meta.fromJson({
        title: 'test',
    });
    // console.log(meta);
    expect(meta.title).toBe('test');
    expect(meta.author).toBeUndefined();
    expect(meta.description).toBeUndefined();
    expect(meta.cover).toBe('cover.jpg');
    expect(meta.coverFile).toBeUndefined();
    expect(meta.autoCover).toBeTruthy();
    expect(meta.uuid).not.toBeNull();
    expect(meta.version).toBe('1.0.0');
});
