import {SiteData} from './SiteData';
import RemoteData from '../spider/RemoteData';
import RemoteImage from '../spider/RemoteImage';

function fetchRemoteData(url: string): Promise<RemoteData> {
    console.log(url);
    const images: RemoteImage[] = [];
    return Promise.resolve(new RemoteData('demo', images));
}

const siteData: SiteData = {
    fetchRemoteData,
    siteName: 'Site Demo',
    urlCheckRegex: /http:\/\/.+/i,
};
export default siteData;
