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
exports.create = exports.createValidation = void 0;
const index_1 = require("./../../../index");
const yup = __importStar(require("yup"));
const middlewares_1 = require("../../shared/middlewares");
exports.createValidation = (0, middlewares_1.validation)({
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
});
const create = async (req, res) => {
    try {
        const { nome, email, role, salary } = req.body;
        const newUser = await index_1.prisma.$transaction(async (tx) => {
            // 1. Cria o usuário
            const user = await tx.user.create({
                data: {
                    name: nome,
                    email,
                    role: role ?? "USER",
                },
            });
            // 2. Se salary foi enviado, cria Salary e SalaryHistory
            if (salary) {
                await tx.salary.create({
                    data: {
                        userId: user.id,
                        amount: salary.amount,
                        currency: salary.currency,
                        position: salary.position,
                    },
                });
                await tx.salaryHistory.create({
                    data: {
                        userId: user.id,
                        amount: salary.amount,
                        currency: salary.currency,
                        position: salary.position,
                        effectiveFrom: new Date(),
                        isCurrent: true,
                    },
                });
            }
            // 3. Retorna usuário criado com salário incluso (se houver)
            return tx.user.findUnique({
                where: { id: user.id },
                include: { salary: true },
            });
        });
        return res.status(201).json(newUser);
    }
    catch (error) {
        console.error(error);
        if (error.code === "P2002") {
            return res.status(409).json({ error: "Email já está em uso" });
        }
        return res.status(500).json({ error: "Erro ao criar usuário" });
    }
};
exports.create = create;
