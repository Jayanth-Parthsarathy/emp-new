"use client";
import { useToast } from "@/components/ui/use-toast";
import * as z from "zod";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import React from "react";

function calculateAge(dateOfBirth: Date): number {
  const currentDate = new Date();
  const dob = new Date(dateOfBirth);

  let age = currentDate.getFullYear() - dob.getFullYear();

  if (
    currentDate.getMonth() < dob.getMonth() ||
    (currentDate.getMonth() === dob.getMonth() &&
      currentDate.getDate() < dob.getDate())
  ) {
    age--;
  }

  return age;
}

const formSchema = z.object({
  name: z.string().min(2).max(50),
  department: z.string().min(2).max(50),
  designation: z.string().min(2).max(50),
  address: z.string().min(2).max(50),
  salary: z.string(),
  dob: z.string(),
});
const EmployeeForm = () => {
  const utils = api.useUtils();
  const router = useRouter();
  const { toast } = useToast();
  const { data: employees } = api.employee.getAll.useQuery();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      department: "",
      designation: "",
      address: "",
      salary: "",
      dob: "",
    },
  });
  const { mutate: createEmployee } = api.employee.create.useMutation({
    onSuccess: async({ name }) => {
      await utils.employee.invalidate();
      toast({
        title: "Employee created successfully",
        description: `${name} was created successfully`,
      });
      router.refresh();
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    let floatSalary = 0;
    const { dob, name, department, designation, address, salary } = values;
    if (!isNaN(parseFloat(salary)) && isFinite(parseFloat(salary))) {
      floatSalary = parseFloat(values.salary);
    }
    createEmployee({
      name,
      department,
      designation,
      address,
      salary: floatSalary,
      dob: new Date(dob),
    });
  }
  return (
    <div className="p-20">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="name..." {...field} />
                </FormControl>
                <FormDescription>This is your name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Input placeholder="department..." {...field} />
                </FormControl>
                <FormDescription>This is your department.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="designation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Designation</FormLabel>
                <FormControl>
                  <Input placeholder="designation..." {...field} />
                </FormControl>
                <FormDescription>This is your designation.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="address..." {...field} />
                </FormControl>
                <FormDescription>This is your address.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary</FormLabel>
                <FormControl>
                  <Input placeholder="salary" {...field} />
                </FormControl>
                <FormDescription>This is your salary.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" placeholder="salary" {...field} />
                </FormControl>
                <FormDescription>This is your salary.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <h3 className="p-10 text-center text-3xl font-semibold">Employee List</h3>
      <Table>
        <TableCaption>A list of your Employees.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Designation</TableHead>
            <TableHead>Date of Birth</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Address</TableHead>
            <TableHead className="text-right">Salary</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees?.map((employee) => (
            <TableRow>
              <TableCell className="font-medium">{employee.name}</TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell>{employee.designation}</TableCell>
              <TableCell>
                {format(new Date(employee.dateOfBirth), "PPP")}
              </TableCell>
              <TableCell>
                {calculateAge(new Date(employee.dateOfBirth))}
              </TableCell>
              <TableCell>{employee.address}</TableCell>
              <TableCell className="text-right">{employee.salary}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeForm;
