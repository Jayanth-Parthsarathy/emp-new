import EmployeeForm from "@/components/custom/employee-form";

export default function Home() {
  return (
    <div className="p-10">
      <h1 className="text-center text-4xl font-semibold">Employee Form</h1>
      <EmployeeForm />
    </div>
  );
}
