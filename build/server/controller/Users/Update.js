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
exports.updateUser = exports.updateUserValidation = void 0;
const index_1 = require("../../../index");
const yup = __importStar(require("yup"));
const middlewares_1 = require("../../shared/middlewares");
exports.updateUserValidation = (0, middlewares_1.validation)({
    body: yup.object({
        nome: yup.string().required("O nome é obrigatório").min(3, "O nome deve ter pelo menos 3 caracteres"),
        email: yup.string().required("O email é obrigatório").email("Formato de email inválido"),
        role: yup.mixed().oneOf(["USER", "ADMIN"]).default("USER").optional(),
        salary: yup.object({
            amount: yup.number().required("O valor do salário é obrigatório"),
            currency: yup.string().required("A moeda é obrigatória"),
            position: yup.string().required("O cargo é obrigatório"),
        }).optional(),
    })
        .strict()
        .noUnknown(true, "Campos não permitidos foram enviados"),
    params: yup.object({
        id: yup.number().integer().required().moreThan(0),
    }),
});
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, role, salary } = req.body;
        // verifica se o usuário existe
        const existingUser = await index_1.prisma.user.findUnique({
            where: { id: Number(id) },
            include: { salary: true },
        });
        if (!existingUser) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        const updatedUser = await index_1.prisma.$transaction(async (tx) => {
            // Atualiza os dados básicos do usuário
            const user = await tx.user.update({
                where: { id: Number(id) },
                data: {
                    name: nome,
                    email,
                    role,
                },
            });
            if (salary) {
                if (existingUser.salary) {
                    // Atualiza salário existente
                    await tx.salary.update({
                        where: { userId: Number(id) },
                        data: {
                            amount: salary.amount,
                            currency: salary.currency,
                            position: salary.position,
                        },
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
                            amount: salary.amount,
                            currency: salary.currency,
                            position: salary.position,
                            effectiveFrom: new Date(),
                            isCurrent: true,
                        },
                    });
                }
                else {
                    // Cria novo salário
                    await tx.salary.create({
                        data: {
                            userId: Number(id),
                            amount: salary.amount,
                            currency: salary.currency,
                            position: salary.position,
                        },
                    });
                    // Cria histórico inicial
                    await tx.salaryHistory.create({
                        data: {
                            userId: Number(id),
                            amount: salary.amount,
                            currency: salary.currency,
                            position: salary.position,
                            effectiveFrom: new Date(),
                            isCurrent: true,
                        },
                    });
                }
            }
            // Retorna usuário atualizado com salário atual
            return tx.user.findUnique({
                where: { id: Number(id) },
                include: { salary: true },
            });
        });
        return res.json(updatedUser);
    }
    catch (error) {
        console.error(error);
        if (error.code === "P2002") {
            return res.status(409).json({ error: "Email já está em uso" });
        }
        return res.status(500).json({ error: "Erro ao atualizar usuário" });
    }
};
exports.updateUser = updateUser;
