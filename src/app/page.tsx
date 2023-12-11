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

export default function Home() {
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
    </div>
  );
}
