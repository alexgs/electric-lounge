/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import * as childProcess from 'child_process';
import * as env from 'env-var';
import * as path from 'path';
import pino from 'pino';
import * as stream from 'stream';

// This file needs to be compiled with `esModuleInterop`, like this:
// npx tsc --esModuleInterop scripts/capture-playlist-snapshot.ts

const SCRIPT_NAME= 'capture-playlist-snapshot';
const LOG_PATH = env.get('LOG_PATH').default(process.cwd()).asString();
const LOG_FILENAME = env.get('LOG_FILENAME').default(`${SCRIPT_NAME}.log`).asString();

async function main() {
  const logStream = new stream.PassThrough();
  const logger = pino({ name: SCRIPT_NAME }, logStream);

  const logFile = path.resolve(LOG_PATH, LOG_FILENAME);
  const tee = childProcess.spawn('tee', [`-a`, logFile], {
    cwd: process.cwd(),
    env: process.env,
  });
  const waitOnTeeExit = new Promise(resolve => {
    tee.on('exit', (code) => {
      resolve(code ?? 0);
    });
  });

  logStream.pipe(tee.stdin);

  const now = new Date();
  logger.info(`The current time is ${now.toISOString()}`);
  tee.kill('SIGTERM');
  return waitOnTeeExit;
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
