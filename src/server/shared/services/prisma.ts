import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); 

// Exporta para usar em outros lugares
export { prisma };