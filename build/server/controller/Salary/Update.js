"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSalary = void 0;
const index_1 = require("../../../index");
const http_status_codes_1 = require("http-status-codes");
const yup = __importStar(require("yup"));
const salaryValidation = yup.object({
    amount: yup
        .number().typeError('O campo deve ser numerico')
        .positive('O salário deve ser maior que zero')
        .required('O campo é obrigatório'),
    currency: yup
        .string()
        .required('O campo é obrigatório')
        .length(3, '"A moeda deve ter exatamente 3 caracteres (ex: BRL, USD)'),
    position: yup
        .string()
        .required('O campo é obrigatório')
        .min(2, 'A posição deve ter pelo menos 2 caracteres'),
});
const updateSalary = async (req, res) => {
    const { id } = req.params;
    const { amount, currency, position } = req.body;
    // Verifica se o usuário existe
    const user = await index_1.prisma.user.findUnique({
        where: { id: Number(id) },
    });
    if (!user) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: "Usuário não encontrado" });
    }
    try {
        const result = await index_1.prisma.$transaction(async (tx) => {
            // Verifica se já existe salário
            const existingSalary = await tx.salary.findUnique({
                where: { userId: Number(id) },
            });
            if (!existingSalary) {
                // Caso não exista salário -> cria salário e histórico inicial
                const salary = await tx.salary.create({
                    data: { amount, currency, position, userId: Number(id) },
                });
                await tx.salaryHistory.create({
                    data: {
                        userId: Number(id),
                        amount,
                        currency,
                        position,
                        effectiveFrom: new Date(),
                        isCurrent: true,
                    },
                });
                return salary;
            }
            // Atualiza o salário atual
            const updatedSalary = await tx.salary.update({
                where: { userId: Number(id) },
                data: { amount, currency, position },
            });
            // Fecha o histórico atual
            await tx.salaryHistory.updateMany({
                where: { userId: Number(id), isCurrent: true },
                data: { effectiveTo: new Date(), isCurrent: false },
            });
            // Cria novo histórico
            await tx.salaryHistory.create({
                data: {
                    userId: Number(id),
                    amount,
                    currency,
                    position,
                    effectiveFrom: new Date(),
                    isCurrent: true,
                },
            });
            return updatedSalary;
        });
        return res.status(http_status_codes_1.StatusCodes.ACCEPTED).json(result);
    }
    catch (err) {
        console.error(err);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Erro ao atualizar salário" });
    }
};
exports.updateSalary = updateSalary;
