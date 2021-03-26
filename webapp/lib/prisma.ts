/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { PrismaClient } from '@prisma/client';

declare global {
  /* eslint-disable no-var */
  // noinspection ES6ConvertVarToLetConst,JSUnusedGlobalSymbols
  var prisma: PrismaClient;
  /* eslint-enable no-var */
}

function getPrismaClient(): PrismaClient {
  // Check to use this workaround only in dev/testing and not in production
  if (process.env.NODE_ENV === 'production') {
    return new PrismaClient();
  } else {
    // PrismaClient is attached to the `global` object in development to prevent
    //   exhausting the database connection limit. [Reference][1]
    // [1]: https://pris.ly/d/help/next-js-best-practices
    if (!global.prisma) {
      global.prisma = new PrismaClient();
    }
    return global.prisma;
  }
}

const prisma = getPrismaClient();

export default prisma;
