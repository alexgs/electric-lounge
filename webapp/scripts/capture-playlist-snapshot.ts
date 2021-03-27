/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import pino from 'pino';

// This file needs to be compiled with `esModuleInterop`, like this:
// npx tsc --esModuleInterop scripts/capture-playlist-snapshot.ts

const SCRIPT_NAME = 'capture-playlist-snapshot';

async function main() {
  const logger = pino({ name: SCRIPT_NAME });

  logger.trace(`Script "${SCRIPT_NAME}" starting.`);
  const now = await new Promise<Date>(resolve => {
    resolve(new Date());
  });
  logger.info(`The current time is ${now.toISOString()}`);
  logger.trace(`Script "${SCRIPT_NAME}" finished.`);
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
