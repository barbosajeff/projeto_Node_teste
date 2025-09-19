"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const server_1 = require("./server/server");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.prisma = prisma;
const PORT = process.env.PORT || 3333;
server_1.server.listen(PORT, () => {
    console.log(`🚀 App rodando na porta ${PORT}`);
});
