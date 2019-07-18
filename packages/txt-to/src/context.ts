/**
 * 当前版本号。
 */
export const VERSION = require('../package.json').version;

export const FOLDER_PREFIX = '__t2e.';

/**
 * metadata 文件夹名称
 */
export const METADATA_FOLDER = `${FOLDER_PREFIX}data`;

/**
 * 分隔的文本输出目录名。
 */
export const SPLIT_OUTPUT_FOLDER = `${FOLDER_PREFIX}split`;

/**
 * epub 的输出目录名。
 */
export const EPUB_OUTPUT_FOLDER = `${FOLDER_PREFIX}epubfiles`;

/**
 * METADATA_FOLDER 下的 metadata 文件
 */
export const METADATA_YAML = 'metadata.yml';

/**
 * 目录定义，如果此文件不存在则直接使用文件名作为目录。
 */
export const TOC_FILE = 'toc.md';

/**
 * 用于定义 epub 存储路径，前提是未指定 epub 存储路径的时候调用
 */
export const EPUB_YAML = '__epub.yml';
