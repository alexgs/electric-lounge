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

const SCRIPT_NAME = 'capture-playlist-snapshot';
const LOG_PATH = env.get('LOG_PATH').default(process.cwd()).asString();
const LOG_FILENAME = env
  .get('LOG_FILENAME')
  .default(`${SCRIPT_NAME}.log`)
  .asString();

function getLogger(
  name: string,
  file: string,
): [pino.Logger, () => Promise<number>] {
  // Create a logger with Pino
  const logStream = new stream.PassThrough();
  const logger = pino({ name }, logStream);

  // Spawn a separate process to handle writing events to a file, per Pino standard practices
  const tee = childProcess.spawn('tee', [`-a`, file], {
    cwd: process.cwd(),
    env: process.env,
  });

  // Create a Promise that resolves when the child `tee` process exits
  const waitOnTeeExit: Promise<number> = new Promise((resolve) => {
    tee.on('exit', (code) => {
      resolve(code ?? 0);
    });
  });

  // Connect the Pino logger to the child `tee` process
  logStream.pipe(tee.stdin);

  // TODO Pipe child.stdout to this process's stdout

  // Function to close the child process when we're done logging
  async function close() {
    tee.kill('SIGTERM');
    return waitOnTeeExit;
  }

  return [logger, close];
}

async function main() {
  const logFile = path.resolve(LOG_PATH, LOG_FILENAME);
  const [logger, closeLogger] = getLogger(SCRIPT_NAME, logFile);

  logger.trace(`Script "${SCRIPT_NAME}" starting.`);
  const now = new Date();
  logger.info(`The current time is ${now.toISOString()}`);
  logger.trace(`Script "${SCRIPT_NAME}" finished.`);

  const teeCode = await closeLogger();
  console.log(`[${SCRIPT_NAME}] Child log-writer exited with code ${teeCode}.`);
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
