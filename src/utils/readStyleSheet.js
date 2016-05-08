import CleanCSS from 'clean-css';
import path from 'path';
import readFile from './readFile';

export default async function readStyleSheet(styleSheetPath) {
  const styleSheetSource = await readFile(styleSheetPath);
  const styleSheet = (new CleanCSS({
    processImport: true,
    processImportFrm: ['local'],
    relativeTo: path.dirname(styleSheetPath)
  })).minify(styleSheetSource).styles;
  return styleSheet;
}
