import { redirect } from "next/navigation";

// This page redirects to the programs page with create mode
export default function CreateProgram() {
  redirect("/admin/programs");
}