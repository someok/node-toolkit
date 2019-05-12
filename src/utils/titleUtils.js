/**
 * 如果给定参数中存在「作者」字样，则将其前面部分截取作为标题。
 *
 * 如果开头就是作者，则不做任何截取，完整返回整个标题。
 *
 * @param name
 */
exports.getTitle = function(name) {
    const pos = name.indexOf('作者');
    return pos > 0 ? name.substring(0, pos).trim() : name.trim();
};

exports.getAuthor = function(name) {
    const re = /.+作者[&续写]{0,3}[:：]*(.*)[\]]?/s;
    const match = re.exec(name.trim());
    if (match) {
        let author = match[1].trim();
        if (author) {
            if (author.endsWith(']') || author.endsWith('】')) {
                author = author.substr(0, author.length - 1);
            }
            return author;
        }
        return null;
    }
    return null;
};
