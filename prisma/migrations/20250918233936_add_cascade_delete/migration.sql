-- DropForeignKey
ALTER TABLE "public"."Salary" DROP CONSTRAINT "Salary_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SalaryHistory" DROP CONSTRAINT "SalaryHistory_userId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Salary" ADD CONSTRAINT "Salary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SalaryHistory" ADD CONSTRAINT "SalaryHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
