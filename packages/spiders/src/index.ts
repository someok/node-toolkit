#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */
import boxen from 'boxen';
import chalk from 'chalk';
import inquirer from 'inquirer';

import {readEnv} from '@someok/comic-spider/src/spider/envConfig';
import {logError, logInfo, logWarning} from '@someok/node-utils';
import {fetchAlbum, fetchGroup} from './mn5-spider';

function initEnv(): boolean {
    let env;
    try {
        env = readEnv();
        if (!env) return false;
    } catch (e) {
        logError(e.message);
        return false;
    }

    if (!process.env.MN5_SPIDER_DATA_DIR) {
        const msg = '「~/.comic-spider/env」 中需配置 MN5_SPIDER_DATA_DIR 指向数据存储目录';

        const boxenOptions: boxen.Options = {
            padding: {left: 6, right: 6, top: 1, bottom: 1},
            borderStyle: boxen.BorderStyle.DoubleSingle,
            borderColor: 'redBright',
        };
        console.log(boxen(chalk.red(msg), boxenOptions));

        return false;
    }

    return true;
}

interface ChoiceItem {
    title: string;
    re: RegExp;
}
interface Choice {
    [key: string]: ChoiceItem;
}
function fetchPrompts() {
    const pkg = require('../package.json');

    console.log(chalk.bold.cyan(`\nMN5 Spider v${pkg.version}\n`));

    const choiceDefine: Choice = {
        album: {
            title: '个人写真集',
            re: /^https:\/\/www.mn5.cc\/[\w-_]+\/[\w-_]+.html$/,
        },
        group: {
            title: '写真集大类',
            re: /^https:\/\/www.mn5.cc\/[\w-_]+\/?$/,
        },
    };

    const choices: inquirer.ChoiceOptions[] = Object.keys(choiceDefine).map(key => ({
        name: choiceDefine[key]['title'],
        value: key,
    }));

    const questions: inquirer.QuestionCollection = [
        {
            type: 'list',
            name: 'type',
            choices,
            default: 'album',
            message: '请选择下载类别',
        },
        {
            type: 'input',
            name: 'url',
            message: function (answers: inquirer.Answers): string {
                const {type} = answers;
                return `请输入 ${choiceDefine[type].title} 完整链接：`;
            },
            validate: function (input: string, answers: inquirer.Answers): boolean | string {
                const {type} = answers;
                const {re} = choiceDefine[type];
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
            const {url, type} = answers;
            const rootDir = process.env.MN5_SPIDER_DATA_DIR;

            if (!rootDir) {
                logWarning('MN5_SPIDER_DATA_DIR 未定义');
                return;
            }

            let promise;
            if (type === 'album') {
                promise = fetchAlbum(rootDir, url);
            } else {
                promise = fetchGroup(rootDir, url);
            }
            promise
                .catch(e => {
                    logError(e);
                })
                .finally(() => {
                    logInfo('over...');
                });
        }

        console.log();
    });
}

if (initEnv()) {
    fetchPrompts();
}
