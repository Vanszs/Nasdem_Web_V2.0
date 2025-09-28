import { redirect } from "next/navigation";

// This page redirects to the users page with create mode
export default function CreateUser() {
  redirect("/admin/user");
}