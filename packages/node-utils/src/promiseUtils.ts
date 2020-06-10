export function waitting(sec = 1, fn: Function): Promise<void> {
    return new Promise(resolve => {
        if (fn) fn(sec);
        setTimeout(() => resolve(), sec * 1000);
    });
}
