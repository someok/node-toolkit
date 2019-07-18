import {createTempFolder as createPrefixTempFolder} from '@someok/node-utils';

export function createTempFolder(): string {
    return createPrefixTempFolder('cs-');
}
