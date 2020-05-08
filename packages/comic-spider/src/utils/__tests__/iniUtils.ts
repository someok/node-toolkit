import path from 'path';
import fse from 'fs-extra';

import {readIniFile} from '../iniUtils';

test('read not exist ini file', (): void => {
    const iniPath = path.resolve(__dirname, 'ini123', 'not_exist.ini');
    const {iniReader} = readIniFile(iniPath);

    expect(fse.existsSync(iniPath)).toBeTruthy();
    expect(iniReader.length).toBe(0);

    fse.removeSync(path.dirname(iniPath));
});

test('read and write ini file', async (done): Promise<void> => {
    const iniPath = path.resolve(__dirname, 'ini', 'test.ini');
    const {iniReader} = readIniFile(iniPath);
    // console.log(ini);

    // console.log(ini.path());
    expect(iniReader.get('some')).toBe('foo');
    expect(iniReader.get('other')).toBe('中文');

    iniReader.set('new', '新数据');
    iniReader.set('single', '单个字段');
    // console.log(ini);

    const dest = path.resolve(__dirname, 'dest');
    fse.ensureDirSync(dest);

    const data = await iniReader.save(path.resolve(dest, 'test.ini'));
    expect(typeof data).toBe('string');
    expect(data).toContain('新数据');
    // console.log('save...', data);

    fse.removeSync(dest);
    expect(fse.existsSync(dest)).toBeFalsy();

    done();
});
