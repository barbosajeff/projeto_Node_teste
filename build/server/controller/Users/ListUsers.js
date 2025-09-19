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
exports.listUsers = exports.listUsersValidation = void 0;
const index_1 = require("../../../index");
const client_1 = require("@prisma/client");
const middlewares_1 = require("../../shared/middlewares");
const yup = __importStar(require("yup"));
exports.listUsersValidation = (0, middlewares_1.validation)({
    query: yup.object({
        page: yup.number().optional().moreThan(0),
        limit: yup.number().optional().moreThan(0),
        filter: yup.string().optional(),
    })
});
const listUsers = async (req, res) => {
    try {
        const { page = "1", limit = "10", q, sort } = req.query;
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const skip = (pageNum - 1) * limitNum;
        // Filtro por nome ou email
        const where = q
            ? {
                OR: [
                    { name: { contains: q, mode: client_1.Prisma.QueryMode.insensitive } },
                    { email: { contains: q, mode: client_1.Prisma.QueryMode.insensitive } },
                ],
            }
            : undefined;
        // ↕️ Ordenação (?sort=name:asc ou ?sort=createdAt:desc)
        let orderBy = { createdAt: "desc" }; // padrão
        if (sort) {
            const [field, direction] = sort.split(":");
            if (field) {
                orderBy = {
                    [field]: direction === "desc" ? "desc" : "asc",
                };
            }
        }
        // 📄 Consulta no banco
        const [users, total] = await Promise.all([
            index_1.prisma.user.findMany({
                where,
                orderBy,
                skip,
                take: limitNum,
            }),
            index_1.prisma.user.count({ where }),
        ]);
        return res.json({
            data: users,
            meta: {
                total,
                page: pageNum,
                lastPage: Math.ceil(total / limitNum),
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao buscar usuários" });
    }
};
exports.listUsers = listUsers;
