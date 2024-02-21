import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const employeeRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.employee.findMany();
  }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(2).max(50),
        department: z.string().min(2).max(50),
        designation: z.string().min(2).max(50),
        customId: z.string().min(2).max(50),
        salary: z.number(),
        dob: z.date(),
        gender: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      console.log(input);
      const { name, department, designation, gender, customId, salary, dob } =
        input;
      return ctx.db.employee.create({
        data: {
          name,
          department,
          salary,
          dateOfBirth: dob,
          designation,
          customId,
          gender,
        },
      });
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      console.log(input);
      const { id } = input;
      return ctx.db.employee.delete({
        where: {
          id,
        },
      });
    }),
});
