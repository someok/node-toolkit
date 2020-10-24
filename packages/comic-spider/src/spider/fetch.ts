import path from 'path';
import fs from 'fs';
import stream from 'stream';
import {promisify} from 'util';
import got, {Agents, OptionsOfTextResponseBody, Response, StreamOptions} from 'got';
import https from 'https';
import tunnel from 'tunnel';
import {getProxyEnv} from './envConfig';
import {waitting} from '@someok/node-utils';

const pipeline = promisify(stream.pipeline);

function getAgent(useAgent?: boolean): Agents | false | undefined {
    if (!useAgent) return false;

    const {host, port} = getProxyEnv();
    if (host && port) {
        return {
            http: tunnel.httpOverHttp({
                proxy: {
                    host,
                    port,
                },
            }),
            https: tunnel.httpsOverHttp({
                proxy: {
                    host,
                    port,
                },
            }) as https.Agent,
        };
    }

    return false;
}

interface FetchResolve {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: any;
    resp: Response;
}

interface FetchOptions {
    useAgent?: boolean;
    options?: OptionsOfTextResponseBody;
}

export interface FetchStreamOptions {
    useAgent?: boolean;
    /**
     * 返回图片如果小于此值，可以认为是失败，需要重试
     */
    minSize?: number;

    /**
     * 请求失败后最大重试次数，不提供则默认值为 3
     */
    maxRetryTimes?: number;

    /**
     * 读取间隔，单位毫秒，默认为 0，表示无间隔
     */
    fetchGap?: number;
    /**
     * 用于在调用时定义 gap 值，例如返回个随机数，此参数的优先级高于 fetchGap
     */
    fetchGapFun?: () => number;
    fetchGapCallback?: (sec: number) => void;
    options?: StreamOptions;
}

/**
 * 使用 request 读取给定 url，并返回 Promise
 *
 * @param url 链接
 * @param fetchOptions 属性
 */
export function fetch(url: string, fetchOptions: FetchOptions = {}): Promise<FetchResolve> {
    const {useAgent = true, options} = fetchOptions;
    const settings = {
        agent: getAgent(useAgent),
        ...options,
    };
    // console.log(settings);

    return got(url, settings).then(
        (resp: Response): FetchResolve => {
            // console.log(resp.statusCode);
            return {body: resp.body, resp};
        }
    );
}

interface FetchImageResolve {
    url: string;
    imgFile: string;
    filename: string;
    remoteImgSize: number;
    localImgSize: number;
}

/**
 * 下载图片到本地。
 *
 * @param url 图片链接
 * @param toDir 存储位置
 * @param title 图片标题
 * @param fetchOptions 其它可选属性
 */
export function fetchImage(
    url: string,
    toDir: string,
    title: string,
    fetchOptions: FetchStreamOptions = {}
): Promise<FetchImageResolve> {
    const {fetchGap = 0, fetchGapFun, fetchGapCallback} = fetchOptions;

    let gap = fetchGap;

    if (fetchGapFun) {
        gap = fetchGapFun();
    }
    if (gap > 0) {
        return waitting(gap, fetchGapCallback).then(() =>
            fetchImageInner(url, toDir, title, fetchOptions)
        );
    }
    return fetchImageInner(url, toDir, title, fetchOptions);
}

function fetchImageInner(
    url: string,
    toDir: string,
    title: string,
    fetchOptions: FetchStreamOptions = {}
): Promise<FetchImageResolve> {
    const {useAgent = true, options} = fetchOptions;

    const imgFile = path.join(toDir, title);

    // 用于比较本地图片和远程图片大小是否一致
    let remoteImgSize = 0;
    let localImgSize: number;

    return new Promise<FetchImageResolve>((resolve, reject): void => {
        pipeline(
            got
                .stream(url, {
                    agent: getAgent(useAgent),
                    timeout: 20 * 1000, // 在下载图片的时候如果不设置此属性，可能导致下载线程迟迟无法结束
                    ...options,
                })
                .on('response', (response: Response): void => {
                    try {
                        remoteImgSize = parseInt(response.headers['content-length'] || '0', 10);
                    } catch (e) {}
                }),
            fs.createWriteStream(imgFile)
        )
            .then((): void => {
                fs.stat(imgFile, (err, stats): void => {
                    localImgSize = stats.size;

                    resolve({url, imgFile, filename: title, localImgSize, remoteImgSize});
                });
            })
            .catch((err): void => {
                reject(err);
            });
    });
}
