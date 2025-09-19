import { server } from './server/server';
import { prisma } from './server/shared/services/prisma';

export { prisma };

const PORT = process.env.PORT || 3333;

server.listen(PORT, () => {
  console.log(`🚀 App rodando na porta ${PORT}`);
});