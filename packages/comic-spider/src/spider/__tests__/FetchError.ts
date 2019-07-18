import FetchError from '../FetchError';

test('FetchError', (): void => {
    try {
        // noinspection ExceptionCaughtLocallyJS
        throw new FetchError(200);
    } catch (e) {
        expect(e instanceof FetchError).toBeTruthy();
        expect(e.statusCode as FetchError).toBe(200);
    }
});
