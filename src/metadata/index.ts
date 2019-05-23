import path from 'path';
import os from 'os';
import inquirer from 'inquirer';
import chalk from 'chalk';
import {existDir} from '@someok/node-utils/lib/fileUtils';
import {logError, logWarning} from '@someok/node-utils/lib/logUtils';

import {getAuthor, getTitle} from '../utils/titleUtils';
import {VERSION} from '../context';
import {initMetadata} from './metadata';
import Meta from './Meta';

function getQuestions(txtFolder: string) {
    const folderQuestion = {
        type: 'input',
        name: 'folder',
        message: '请输入 txt 所在目录（此目录必须已经存在）：',
        default: txtFolder,
        validate: function validate(input: string) {
            const isFolder = existDir(input);
            if (isFolder) {
                return isFolder;
            }

            return chalk.bold.red('不是有效路径，请重新输入');
        },
    };

    const titleQuestion = {
        type: 'input',
        name: 'title',
        message: '请输入 epub 书名：',
        default: function def(answers: inquirer.Answers) {
            const name = path.basename(answers.folder);
            return getTitle(name);
        },
    };

    const questions = [
        folderQuestion,
        titleQuestion,
        {
            type: 'input',
            name: 'author',
            message: '请输入作者：',
            default: function def(answers: inquirer.Answers) {
                const username = os.userInfo().username;
                const name = path.basename(answers.folder);
                const author = getAuthor(name);
                return author || username;
            },
        },
        {
            type: 'input',
            name: 'description',
            message: '请输入简介（可以为空）：',
        },
        {
            type: 'confirm',
            name: 'confirm',
            message: '确认上述信息正确?',
            default: true,
        },
    ];

    return questions;
}

/**
 * 通过命令行初始化 metadata 信息。
 *
 * 也就是在给定目录下初始化 __t2e.data 目录，以及下面的相应 yaml。
 *
 * @param txtFolder txt 所在根目录
 */
export default function(txtFolder: string) {
    const questions = getQuestions(txtFolder);

    console.log(chalk.bold.cyan(`\n...Txt2Eput ${VERSION} metadata init...\n`));

    inquirer.prompt(questions).then((answers: inquirer.Answers) => {
        console.log();
        // console.log(answers);
        if (!answers.confirm) {
            logWarning('放弃初始化!');
        } else {
            const {folder, title, author, description} = answers;
            const meta = new Meta(title, author, description, 'cover.jpg');
            initMetadata(folder, meta, {createCover: true}).catch(err => {
                logError(err.message);
            });
        }

        console.log();
    });
}
