import path from 'path';
import fs from 'fs';
import request from 'requestretry';
import requestBase from 'request';
import FetchError from './FetchError';

const REQUEST_OPTIONS = {
    method: 'GET',

    // 重试次数
    maxAttempts: 3,
    // 重试前延时，单位毫秒
    retryDelay: 3000,

    // proxy: 'http://127.0.0.1:6152',

    headers: {
        'User-Agent':
            'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.54 Safari/537.36',
        // 'Cache-Control': 'no-cache, no-store, must-revalidate'
    },
};

function responseHttpError(resp?: requestBase.Response): boolean {
    const statusCode = resp ? resp.statusCode : null;

    return !!(statusCode && statusCode >= 400);
}

/**
 * 返回数据的错误检测。
 *
 * @param err
 * @param resp
 * @param body
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function responseError(err: any, resp: requestBase.Response, body: any): boolean {
    return responseHttpError(resp) || request.RetryStrategies.NetworkError(err, resp, body);
}

// request.debug = true;

interface FetchResolve {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: any;
    resp: requestBase.Response;
}

const NOT_PRE_DEFINED_STATUS_CODE = 777;

/**
 * 使用 request 读取给定 url，并返回 Promise
 *
 * @param url 链接
 * @param options {@link request} 属性
 */
export function fetch(url: string, options?: request.RequestRetryOptions): Promise<FetchResolve> {
    const settings = Object.assign({}, REQUEST_OPTIONS, {url}, options);

    return new Promise((resolve, reject): void => {
        request(settings, function(err, resp, body): void {
            if (responseError(err, resp, body)) {
                if (err) {
                    if (resp && resp.statusCode) {
                        err.statusCode = resp.statusCode;
                    } else {
                        err.statusCode = NOT_PRE_DEFINED_STATUS_CODE;
                    }
                    reject(err);
                } else {
                    let statusCode = NOT_PRE_DEFINED_STATUS_CODE;
                    if (resp && resp.statusCode) {
                        statusCode = resp.statusCode;
                    }
                    reject(new FetchError(statusCode));
                }
            } else {
                resolve({body, resp});
            }
        });
    });
}

/**
 * 将 request 封装成 Promise，并支持 pipe stream 模式，这点与 {@link fetch} 有所不同。
 *
 * @param url 链接
 * @param options request 属性
 */
export function fetchStream(
    url: string,
    options?: request.RequestRetryOptions
): Promise<requestBase.Response> {
    return new Promise(function(resolve, reject): void {
        const settings = Object.assign({}, REQUEST_OPTIONS, {url}, options);

        const req = request(settings, function(err): void {
            if (err) {
                // console.log(err);
                reject(err);
            }
        });
        // 注意：不能在这儿使用 on 捕获事件，在第一次重试之前就会抛出错误
        // req.on('error', err => {
        //     console.log(err);
        // });
        req.on('response', function(resp): void {
            if (responseHttpError(resp)) {
                console.log('http error');
                reject(new FetchError(resp.statusCode));
            } else {
                resp.pause();

                resolve(resp);
            }
        });
    });
}

interface FetchImageResolve {
    resp: requestBase.Response;
    remoteImgSize: number;
    localImgSize: number;
}

/**
 * 下载图片到本地。
 *
 * @param url 图片链接
 * @param toDir 存储位置
 * @param title 图片标题
 * @param options 其它可选 request 属性
 */
export function fetchImage(
    url: string,
    toDir: string,
    title: string,
    options?: request.RequestRetryOptions
): Promise<FetchImageResolve> {
    const ext = path.extname(url);
    const newTitle = title + ext;
    const imgFile = path.join(toDir, newTitle);

    let response: requestBase.Response;
    // 用于比较本地图片和远程图片大小是否一致
    let remoteImgSize: number;
    let localImgSize: number;

    return new Promise<FetchImageResolve>(function(resolve, reject): void {
        const imgStream = fs.createWriteStream(imgFile);
        imgStream.on('close', (): void => {
            fs.stat(imgFile, (err, stats): void => {
                localImgSize = stats.size;

                resolve({resp: response, localImgSize, remoteImgSize});
            });
        });

        fetchStream(url, options)
            .then((resp): void => {
                resp.request.on('complete', (res): void => {
                    const contentLength = res.headers['content-length'];
                    if (contentLength) {
                        remoteImgSize = parseInt(contentLength, 10);
                    }
                });

                resp.pipe(imgStream);

                response = resp;
            })
            .catch((err): void => {
                reject(err);
            });
    });
}
