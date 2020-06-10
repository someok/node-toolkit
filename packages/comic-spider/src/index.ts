#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import path from 'path';
import _ from 'lodash';

import {existDataDir, readEnv} from './spider/envConfig';
import {logError, logInfo, logWarning} from '@someok/node-utils';
import {SiteData} from './sites/SiteData';
import {fetchAndOutputImages} from './spider/output';
import {writeUrl2ReadmeTxt} from './spider/readme';
import {readIniFile, saveIniFile} from './utils/iniUtils';

interface Sites {
    [key: string]: SiteData;
}

const sites: Sites = {
    site177pic: require('./sites/177pic').default,
    nyahentai: require('./sites/nyahentai').default,
    allporncomic: require('./sites/allporncomic').default,
    siteDemo: require('./sites/demo').default,
};

function initEnv(): boolean {
    try {
        const env = readEnv();
        if (!env) return false;
    } catch (e) {
        logError(e.message);
        return false;
    }
    try {
        return existDataDir();
    } catch (e) {
        logError(e.message);
        return false;
    }
}

// todo: 使用其它类似组件替换 inquirer，后者太重了
//  当前可选(推荐后一个)：
//    https://github.com/terkelg/prompts
async function fetchData(site: string, url: string): Promise<void> {
    const {fetchRemoteData} = sites[site];
    const dataDir = process.env.COMIC_SPIDER_DATA_DIR;
    try {
        const data = await fetchRemoteData(url);
        // console.log(data);
        if (_.isEmpty(data)) {
            logWarning('未获取任何图片数据');
            return;
        }

        // todo: 判断目标文件是否存在，如果存在则提示是否覆盖

        if (dataDir) {
            const toDir = path.join(dataDir, data.title);
            logInfo(`[${data.title}] 存储于 [${dataDir}]`);

            fetchAndOutputImages(toDir, data.images);

            writeUrl2ReadmeTxt(toDir, url);
        }
    } catch (e) {
        logError(e.message);
    }
}

//    https://github.com/enquirer/enquirer
function fetchPrompts(): void {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pkg = require('../package.json');
    console.log(chalk.bold.cyan(`\nComic Spider v${pkg.version}\n`));

    const {iniReader} = readIniFile();
    const defaultSite = iniReader.get('site') || 0;

    const siteChoices = Object.keys(sites).map((key): {name: string; value: string} => {
        const site = sites[key];
        return {
            name: site.siteName,
            value: key,
        };
    });
    const questions: inquirer.QuestionCollection = [
        {
            type: 'list',
            name: 'site',
            choices: siteChoices,
            default: defaultSite,
            message: '请选择站点',
        },
        {
            type: 'input',
            name: 'url',
            message: function (answers: inquirer.Answers): string {
                const {site} = answers;
                return `请输入 ${sites[site].siteName} 完整链接：`;
            },
            validate: function (input: string, answers: inquirer.Answers): boolean | string {
                if (!answers) {
                    return true;
                }
                const {site} = answers;
                const re = sites[site].urlCheckRegex;
                const url = input.trim();
                if (re.test(url)) {
                    return true;
                }

                return chalk.bold.red('请输入有效链接');
            },
        },
        {
            type: 'confirm',
            name: 'confirm',
            message: '确定下载?',
            default: true,
        },
    ];

    inquirer.prompt(questions).then(function (answers: inquirer.Answers): void {
        console.log();

        if (!answers.confirm) {
            logWarning('放弃下载!');
        } else {
            const {site, url} = answers;

            // 将选择的 site 保存到配置中
            if (site !== defaultSite) {
                iniReader.set('site', site);

                saveIniFile(iniReader).catch((e): void => {
                    console.log(e.message);
                });
            }

            // noinspection JSIgnoredPromiseFromCall
            fetchData(site, url);
        }

        console.log();
    });
}

if (initEnv()) {
    fetchPrompts();
}
