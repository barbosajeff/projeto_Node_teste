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
exports.deleteSalaty = exports.deleteValidation = void 0;
const http_status_codes_1 = require("http-status-codes");
const index_1 = require("../../../index");
const middlewares_1 = require("../../shared/middlewares");
const yup = __importStar(require("yup"));
exports.deleteValidation = (0, middlewares_1.validation)({
    params: yup.object({
        id: yup.number().integer().required().moreThan(0),
    })
});
const deleteSalaty = async (req, res) => {
    try {
        const { id } = req.params;
        const salary = await index_1.prisma.salary.findUnique({
            where: { userId: Number(id) },
        });
        if (!salary) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ error: 'Salário não encontrado' });
        }
        await index_1.prisma.salary.delete({
            where: { userId: Number(id) },
        });
        return res.json({ message: "Salário removido com sucesso" });
    }
    catch (error) {
        console.error(error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Erro ao remover salário" });
    }
};
exports.deleteSalaty = deleteSalaty;
