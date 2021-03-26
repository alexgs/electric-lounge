/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import prisma from 'lib/prisma';

async function main() {
  const now = new Date();
  console.log(`The current time is ${now.toISOString()}`);
  return Promise.resolve({ exitCode: 0 });
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
