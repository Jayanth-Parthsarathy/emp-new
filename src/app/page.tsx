import EmployeeForm from "@/components/custom/employee-form";
import { api } from "@/trpc/server";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function Home() {
  const employees = await api.employee.getAll.query();
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
  return (
    <div className="p-10">
      <h1 className="text-center text-4xl font-semibold">Employee Form</h1>
      <EmployeeForm />
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
              <TableCell>{calculateAge(new Date(employee.dateOfBirth))}</TableCell>
              <TableCell>{employee.address}</TableCell>
              <TableCell className="text-right">{employee.salary}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
