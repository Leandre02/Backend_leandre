import fs from 'fs-extra';
import logger from 'jet-logger';
import path from 'path';
import childProcess from 'child_process';

import fsNode from 'fs';

/**
 * Start
 */
(async () => {
  try {
    // Remove current build
    await remove('./dist/');
    //await exec('npm run lint', './');
    await exec('tsc --build tsconfig.prod.json', './');
    // Copy
    await copy('./src/public', './dist/public');
    await copy('./src/views', './dist/views');
    // Mettre en commentaire
    // await copy('./src/repos/database.json', './dist/repos/database.json');
    await copy('./temp/config.js', './config.js');
    await copy('./temp/src', './dist');
    await remove('./temp/');
    // Copie de la documentation Swagger
const sourceDoc = path.join(
  __dirname,
  '..',
  'src',
  'config',
  'documentation.json',
);
const destDir = path.join(__dirname, '..', 'dist', 'config');
const destDoc = path.join(destDir, 'documentation.json');

if (fsNode.existsSync(sourceDoc)) {
  // crée le dossier dist/config si besoin
  if (!fsNode.existsSync(destDir)) {
    fsNode.mkdirSync(destDir, { recursive: true });
  }
  fsNode.copyFileSync(sourceDoc, destDoc);
  // logger.info('Doc swagger copiée dans dist/config'); // optionnel
} else {
  logger.warn(
    'documentation.json pas trouvé dans src/config, swagger risque de planter',
  );
}

  } catch (err) {
    logger.err(err);
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  }
})();

/**
 * Remove file
 */
function remove(loc: string): Promise<void> {
  return new Promise((res, rej) => {
    return fs.remove(loc, (err) => {
      return !!err ? rej(err) : res();
    });
  });
}

/**
 * Copy file.
 */
function copy(src: string, dest: string): Promise<void> {
  return new Promise((res, rej) => {
    return fs.copy(src, dest, (err) => {
      return !!err ? rej(err) : res();
    });
  });
}

/**
 * Do command line command.
 */
function exec(cmd: string, loc: string): Promise<void> {
  return new Promise((res, rej) => {
    return childProcess.exec(cmd, { cwd: loc }, (err, stdout, stderr) => {
      if (!!stdout) {
        logger.info(stdout);
      }
      if (!!stderr) {
        logger.warn(stderr);
      }
      return !!err ? rej(err) : res();
    });
  });
}
