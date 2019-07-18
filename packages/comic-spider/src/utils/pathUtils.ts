export function getUserHome(): string | undefined {
    return process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
}

/**
 * 返回以「~」前置的路径为绝对路径。
 *
 * @param dir 路径
 */
export function getAbsolutePath(dir: string): string {
    if (!dir) {
        throw new Error('parameter [dir] not define');
    }

    if (dir.startsWith('~/')) {
        const home = getUserHome();
        if (home) {
            return dir.replace('~', home);
        }
    }

    return dir;
}
