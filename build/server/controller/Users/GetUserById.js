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
exports.getUserById = exports.getBiIdValidation = void 0;
const index_1 = require("./../../../index");
const middlewares_1 = require("../../shared/middlewares");
const yup = __importStar(require("yup"));
exports.getBiIdValidation = (0, middlewares_1.validation)({
    params: yup.object({
        id: yup.number().integer().required().moreThan(0),
    })
});
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        // busca o usuário pelo id, incluindo salary
        const user = await index_1.prisma.user.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                salary: true, // inclui o salary caso exista
            },
        });
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        return res.json(user);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao buscar usuário" });
    }
};
exports.getUserById = getUserById;
