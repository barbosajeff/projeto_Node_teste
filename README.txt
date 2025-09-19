API REST de Usuários e Salários
Descrição do Projeto

Esta API REST construída com Node.js + TypeScript permite gerenciar usuários e o vínculo de salário (1:1) usando Prisma e PostgreSQL. O projeto possui validações de entrada, tipagem adequada, CRUD completo, e opcionalmente mantém histórico de salários.

Stack Utilizada

Node.js + TypeScript

Express

Prisma ORM

PostgreSQL

Validação com Yup

Testes com Jest

ESLint para qualidade de código

Yarn como gerenciador de pacotes

Modelagem
User

id: Int

name: String

email: String (único)

role: USER | ADMIN

createdAt: DateTime

updatedAt: DateTime

salary?: Salary

Salary (1:1 com User)

id: Int

userId: Int (único)

amount: Float

currency: String

position: String

createdAt: DateTime

updatedAt: DateTime

SalaryHistory (opcional)

id: Int

userId: Int

amount: Float

currency: String

position: String

effectiveFrom: DateTime

effectiveTo: DateTime?

isCurrent: Boolean

createdAt: DateTime

updatedAt: DateTime

Endpoints
Usuário
Método	Rota	Descrição
POST	/api/users	Cria usuário
GET	/api/users/getAll	Lista usuários com paginação, filtro e ordenação
GET	/api/users/:id	Detalhes do usuário (inclui salário)
PUT	/api/users/:id	Atualiza usuário
DELETE	/api/users/:id	Remove usuário (apenas ADMIN)
Salário
Método	Rota	Descrição
PUT	/api/salary/:id	Cria/atualiza salário do usuário
GET	/api/salary/:id	Obtém salário do usuário
DELETE	/api/salary/:id	Remove salário do usuário
Histórico de Salários
Método	Rota	Descrição
GET	/api/salaryHistoric/:id	Retorna histórico completo de salários
Funcionalidades

CRUD completo de usuários

CRUD/Upsert de salário por usuário

Transação ao criar usuário com salário

Validações (email válido, amount>0, position obrigatório)

Paginação, filtro e ordenação em /users

Erros consistentes com HTTP Status Codes

Seeds para inicializar banco com ≥ 5 usuários (≥ 3 com salário)

Exemplo de Resposta (UserView)
{
  "id": "e6f3...",
  "name": "Ana Silva",
  "email": "ana@empresa.com",
  "role": "USER",
  "createdAt": "2025-09-11T12:00:00.000Z",
  "updatedAt": "2025-09-11T12:00:00.000Z",
  "salary": {
    "id": "a1b2...",
    "amount": "8500.00",
    "currency": "BRL",
    "position": "Desenvolvedora Pleno",
    "createdAt": "2025-09-11T12:10:00.000Z",
    "updatedAt": "2025-09-11T12:10:00.000Z"
  }
}

Scripts e Comandos
# Instalar dependências
yarn install

# Rodar servidor em desenvolvimento
yarn dev

# Rodar migrations e aplicar no banco
npx prisma migrate dev --name init

# Gerar client Prisma
npx prisma generate

# Abrir Prisma Studio
npx prisma studio

# Rodar testes
yarn test

Observações

Tipagem completa com TypeScript

Organização em camadas: Controller → Service → Repository

Histórico de salários opcional com endpoints dedicados

Autorização simples: apenas ADMIN pode deletar usuário