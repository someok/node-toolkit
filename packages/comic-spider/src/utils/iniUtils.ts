import path from 'path';
import fse from 'fs-extra';
import propertiesReader, {Reader} from 'properties-reader';
import {existFile, getAbsolutePath} from '@someok/node-utils';

interface IniData {
    iniReader: Reader;
    iniFile: string;
}

const DEFAULT_INI_FILE = '~/.comic-spider/data.ini';

export function readIniFile(ini = DEFAULT_INI_FILE): IniData {
    const iniFile = getAbsolutePath(ini);
    if (!existFile(iniFile)) {
        fse.ensureDirSync(path.dirname(iniFile));
        fse.createFileSync(iniFile);
    }

    const iniReader = propertiesReader(iniFile);
    return {iniReader, iniFile};
}

export function saveIniFile(iniReader: Reader, destIni = DEFAULT_INI_FILE): Promise<string> {
    const iniFile = getAbsolutePath(destIni);

    return iniReader.save(iniFile);
}
