#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */

import chalk from 'chalk';
import inquirer from 'inquirer';
import {logWarning} from '@someok/node-utils';
import {SiteData} from './sites/SiteData';
import {getDataDir, initEnv} from './common';
import {getAllReadmeContent} from './spider/readme';

interface Sites {
    [key: string]: SiteData;
}

const sites: Sites = {
    allporncomic: require('./sites/AllPornComicMod').default,
};

function updatePrompts(): void {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pkg = require('../package.json');
    console.log(chalk.bold.cyan(`\nComic Spider Updater v${pkg.version}\n`));

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
            default: 0,
            message: '请选择站点',
        },
        {
            type: 'confirm',
            name: 'confirm',
            message: '确定检查更新?',
            default: true,
        },
    ];

    inquirer.prompt(questions).then(function (answers: inquirer.Answers): void {
        const {site, confirm} = answers;

        if (!confirm) {
            console.log();
            logWarning('放弃!');
        } else {
            const dataDir = getDataDir(site);

            const urls = getAllReadmeContent('/Users/Shared/.ohmygod/已整理/Comic/西漫', data =>
                data.includes('allporncomic.com')
            );

            const {updateAction} = sites[site];
            if (typeof updateAction === 'function') {
                updateAction(dataDir, urls);
            } else {
                logWarning(`${site}中不存在 updateAction 方法！`);
            }
        }

        console.log();
    });
}

if (initEnv()) {
    updatePrompts();
}
