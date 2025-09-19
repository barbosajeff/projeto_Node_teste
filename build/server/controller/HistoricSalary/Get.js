"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSalarys = void 0;
const http_status_codes_1 = require("http-status-codes");
const index_1 = require("../../../index");
const getSalarys = async (req, res) => {
    try {
        const { id } = req.params;
        // Busca o salário atual
        const salary = await index_1.prisma.salary.findUnique({
            where: { userId: Number(id) },
            select: {
                amount: true,
                currency: true,
                position: true,
            },
        });
        if (!salary) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ error: "Salário não encontrado" });
        }
        // Busca todo o histórico de salários
        const history = await index_1.prisma.salaryHistory.findMany({
            where: { userId: Number(id) },
            orderBy: { effectiveFrom: 'desc' },
            select: {
                amount: true,
                currency: true,
                position: true,
                effectiveFrom: true,
                effectiveTo: true,
                isCurrent: true,
            },
        });
        const response = {
            currentSalary: {
                amount: salary.amount,
                currency: salary.currency,
                position: salary.position,
            },
            history,
        };
        return res.json(response);
    }
    catch (error) {
        console.error(error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Erro ao buscar salário" });
    }
};
exports.getSalarys = getSalarys;
