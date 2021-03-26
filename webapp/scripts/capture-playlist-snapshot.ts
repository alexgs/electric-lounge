/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import * as childProcess from 'child_process';
import * as env from 'env-var';
import pino from 'pino';
import * as stream from 'stream';

// This file needs to be compiled with `esModuleInterop`, like this:
// npx tsc --esModuleInterop scripts/capture-playlist-snapshot.ts

const LOG_PATH = env.get('LOG_PATH').default(process.cwd()).asString();

// TODO Wire-up `tee` to capture console output, using the example from the `pino-tee` documentation
async function main() {
  const logThrough = new stream.PassThrough();
  const log = pino({ name: 'capture-playlist-snapshot' }, logThrough) ;
  const child = childProcess.spawn('tee', [`-a`, `log.txt`], {
    cwd: process.cwd(),
    env: process.env,
  });
  logThrough.pipe(child.stdin);

  const now = new Date();
  log.info(`The current time is ${now.toISOString()}`);
  child.kill('SIGTERM');
  return new Promise((resolve) => {
    setTimeout(() => resolve({ exitCode: 0 }), 1000);
  });
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
