"use client";
import { useToast } from "@/components/ui/use-toast";
import * as z from "zod";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { Trash } from "lucide-react";

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
  name: z.string().min(2).max(30),
  department: z.string(),
  designation: z.string().min(2).max(50),
  salary: z.string().min(1).max(8),
  customId: z.string(),
  dob: z.string(),
  gender: z.enum(["male", "female"], {
    required_error: "You need to select a gender.",
  }),
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
      salary: "",
      dob: "",
      gender: "male",
      customId: "",
    },
  });
  const { mutate: createEmployee } = api.employee.create.useMutation({
    onSuccess: async (data) => {
      await utils.employee.invalidate();
      if (data == "TOO OLD") {
        toast({
          title:"Error",
          description: "Entered age is too old",
        });
      } else if (data == "TOO YOUNG") {
        toast({
          title:"Error:",
          description: "Entered age is too young",
        });
      } else {
        toast({
          title: "Employee created successfully",
          description: `${data.name} was created successfully`,
        });
      }
      router.refresh();
    },
  });
  const { mutate: deleteEmployee } = api.employee.delete.useMutation({
    onSuccess: async ({ name }) => {
      await utils.employee.invalidate();
      toast({
        title: "Employee deleted successfully",
        description: `${name} was created successfully`,
      });
      router.refresh();
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if(parseInt(values.salary) < 0){
      toast({
        title: "Error",
        description: `Salary cannot be negative`,
      });
      return
    }
    console.log(values);
    let floatSalary = 0;
    const { dob, name, customId, department, designation, gender, salary } =
      values;
    if (!isNaN(parseFloat(salary)) && isFinite(parseFloat(salary))) {
      floatSalary = parseFloat(values.salary);
    }
    createEmployee({
      name,
      department,
      designation,
      gender,
      customId,
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
            name="customId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee Id</FormLabel>
                <FormControl>
                  <Input placeholder="employee id..." {...field} />
                </FormControl>
                <FormDescription>This is your id.</FormDescription>
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>This is your department</FormDescription>
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a designation" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Yet to be evaluated">Yet to be evaluated</SelectItem>
                    <SelectItem value="Fresher">Fresher</SelectItem>
                    <SelectItem value="Experienced">Experienced</SelectItem>
                    <SelectItem value="Head">Head</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>This is your designation</FormDescription>
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
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Specify your gender</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="male" />
                      </FormControl>
                      <FormLabel className="font-normal">Male</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="female" />
                      </FormControl>
                      <FormLabel className="font-normal">Female</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
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
            <TableHead className="w-[100px]">Employee ID</TableHead>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Designation</TableHead>
            <TableHead>Date of Birth</TableHead>
            <TableHead>Age</TableHead>
            <TableHead className="">Salary</TableHead>
            <TableHead className="">Gender</TableHead>
            <TableHead className="text-right">Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees?.map((employee) => (
            <TableRow>
              <TableCell className="font-medium">{employee.customId}</TableCell>
              <TableCell className="font-medium">{employee.name}</TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell>{employee.designation}</TableCell>
              <TableCell>
                {format(new Date(employee.dateOfBirth), "PPP")}
              </TableCell>
              <TableCell>
                {calculateAge(new Date(employee.dateOfBirth))}
              </TableCell>
              <TableCell className="">{employee.salary}</TableCell>
              <TableCell className="">{employee.gender}</TableCell>
              <TableCell className="text-right">
                <Trash
                  className="ml-auto text-right text-red-500"
                  onClick={() => deleteEmployee({ id: employee.id })}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeForm;
