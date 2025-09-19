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
exports.getSalary = exports.getBiIdValidation = void 0;
const index_1 = require("../../../index");
const middlewares_1 = require("../../shared/middlewares");
const yup = __importStar(require("yup"));
exports.getBiIdValidation = (0, middlewares_1.validation)({
    params: yup.object({
        id: yup.number().integer().required().moreThan(0),
    })
});
const getSalary = async (req, res) => {
    try {
        const { id } = req.params;
        const salary = await index_1.prisma.salary.findUnique({
            where: { userId: Number(id) },
            select: {
                amount: true,
                currency: true,
                position: true,
            },
        });
        if (!salary) {
            return res.status(404).json({ error: "Salário não encontrado" });
        }
        // força o tipo ISalary no retorno
        const salaryResponse = {
            amount: salary.amount,
            currency: salary.currency,
            position: salary.position,
        };
        return res.json(salaryResponse);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao buscar salário" });
    }
};
exports.getSalary = getSalary;
