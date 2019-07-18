import RemoteData from '../spider/RemoteData';

/**
 * 相应站点抓取需要实现的接口
 */
export interface SiteData {
    // 读取图片列表方法
    fetchRemoteData: (url: string) => Promise<RemoteData>;
    // 站点名称
    siteName: string;
    // 站点 url 校验正则表达式
    urlCheckRegex: RegExp;
}
