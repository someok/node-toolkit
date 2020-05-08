/**
 * 如果给定参数中存在「作者」字样，则将其前面部分截取作为标题。
 *
 * 如果开头就是作者，则不做任何截取，完整返回整个标题。
 *
 * @param name 标题
 * @return 从标题中提取出「作者」前面部分
 */
export function getTitle(name: string): string {
    const pos = name.indexOf('作者');
    return pos > 0 ? name.substring(0, pos).trim() : name.trim();
}

/**
 * 如果给定参数中存在「作者」字样，则将其后面面部分截取作为作者。
 *
 * @param name 标题
 * @return 作者信息
 */
export function getAuthor(name: string): string | undefined {
    const re = /.+作者[&续写]{0,3}[:：]*(.*)/s;
    const match = re.exec(name.trim());
    if (match) {
        const author = match[1].trim();
        if (author) {
            return author;
        }
        return undefined;
    }
    return undefined;
}
