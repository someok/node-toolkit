import RemoteData from '../spider/RemoteData';

/**
 * 相应站点抓取需要实现的接口
 */
export interface SiteData {
    /**
     * 读取图片列表方法
     *
     * @param url 目标网站 url
     */
    fetchRemoteData: (url: string) => Promise<RemoteData>;

    /**
     * 对于部分站点来说使用需要定制专门的下载方法，所以可以实现此方法来完全控制下载过程。
     * 也就是说如果站点配置了此方法，则会忽略 fetchRemoteData。
     *
     * @param rootDir 存储的根路径
     * @param url 目标 url
     * @param overwrite 是否覆盖
     */
    fetchAlong?: (rootDir: string, url: string, overwrite: boolean) => Promise<boolean>;

    /**
     * 按照 readme.txt 中的地址更新
     *
     * @param rootDir 存储的根路径
     * @param urls 从 readme.txt 中读取的 url 列表
     */
    updateAction?: (rootDir: string, urls: string[]) => Promise<boolean>;

    /**
     * 根据 readme 中读取的内容判断是否符合更新要求
     *
     * @param data readme 中的字符串
     */
    updateFilter?: (data: string) => boolean;

    /**
     * 站点名称
     */
    siteName: string;
    /**
     * 站点 url 校验正则表达式
     */
    urlCheckRegex: RegExp;
}
