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
        address: z.string().min(2).max(50),
        salary: z.number(),
        dob: z.date(),
      }),
    )
    .mutation(({ ctx, input }) => {
      console.log(input);
      const { name, department, designation, address, salary, dob } = input;
      return ctx.db.employee.create({
        data: {
          name,
          department,
          address,
          salary,
          dateOfBirth: dob,
          designation,
        },
      });
    }),
});
