#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */

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
import {isAlbumExist} from './utils/fileUtils';

import fse from 'fs-extra';

interface Sites {
    [key: string]: SiteData;
}

const sites: Sites = {
    _177pic: require('./sites/177pic').default,
    _18comic: require('./sites/18comic').default,
    nyahentai: require('./sites/nyahentai').default,
    allporncomic: require('./sites/allporncomic').default,
    mn5album: require('./sites/mn5').mn5AlbumSiteData,
    mn5group: require('./sites/mn5').mn5GroupSiteData,
    // siteDemo: require('./sites/demo').default,
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

/**
 * 返回给定站点对应的存储地址，如果没有则使用默认的配置。
 *
 * 查找顺序（以 _177pic 为例）：
 *      1、COMIC_SPIDER_DATA_DIR_177PIC
 *      2、COMIC_SPIDER_DATA_DIR
 *
 * 注意：如果某个站点配置了独立的存储地址，配置时需注意命名，例如 _177pic，会去掉前面的下划线，并且将其转为大写，
 * 然后合并到 COMIC_SPIDER_DATA_DIR_ 后面。
 *
 * @param site 站点名称
 */
function getDataDir(site: string): string {
    // 去掉开头的下划线
    const siteName = site.replace(/^_*/, '').toUpperCase();

    const envSites = [`COMIC_SPIDER_DATA_DIR_${siteName}`, 'COMIC_SPIDER_DATA_DIR'];
    for (const envSite of envSites) {
        const procEnv = process.env[envSite];
        if (procEnv) {
            return procEnv;
        }
    }

    throw new Error('COMIC_SPIDER_DATA_DIR 配置不存在');
}

// todo: 使用其它类似组件替换 inquirer，后者太重了
//  当前可选(推荐后一个)：
//    https://github.com/terkelg/prompts
async function fetchData(site: string, url: string, overwrite: boolean): Promise<void> {
    const {fetchRemoteData, fetchAlong} = sites[site];
    const dataDir = getDataDir(site);

    if (fetchAlong) {
        await fetchAlong(dataDir, url, overwrite);
        return;
    }

    try {
        const data = await fetchRemoteData(url);
        // console.log(data);
        if (_.isEmpty(data) || _.isEmpty(data.images)) {
            logWarning('未获取任何图片数据');
            return;
        }

        if (dataDir) {
            const toDir = path.join(dataDir, data.title);
            // 判断目标文件是否存在，如果存在则提示是否覆盖
            if (!overwrite && isAlbumExist(toDir, data.images)) {
                logInfo(`${data.title} 已存在，此操作将忽略`);

                return;
            }

            fse.ensureDirSync(toDir);

            logInfo(`[${data.title}] 存储于 [${dataDir}]`);

            writeUrl2ReadmeTxt(toDir, url);
            await fetchAndOutputImages(toDir, data.images);
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
            name: 'overwrite',
            message: '是否覆盖下载?',
            default: false,
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

        const {site, url, overwrite, confirm} = answers;

        if (!confirm) {
            logWarning('放弃下载!');
        } else {
            // 将选择的 site 保存到配置中
            if (site !== defaultSite) {
                iniReader.set('site', site);

                saveIniFile(iniReader).catch((e): void => {
                    console.log(e.message);
                });
            }

            fetchData(site, url, overwrite).catch(e => {
                console.log(e);
            });
        }

        console.log();
    });
}

if (initEnv()) {
    fetchPrompts();
}
