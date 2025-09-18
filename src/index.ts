import { server } from './server/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); 

// Exporta para usar em outros lugares
export { prisma };

const PORT = process.env.PORT || 3333;

server.listen(PORT, () => {
  console.log(`🚀 App rodando na porta ${PORT}`);
});