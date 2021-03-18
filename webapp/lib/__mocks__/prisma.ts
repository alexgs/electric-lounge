import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';

if (!global.prisma) {
  global.prisma = mockDeep<PrismaClient>();
}
prisma = global.prisma;

export default prisma;
