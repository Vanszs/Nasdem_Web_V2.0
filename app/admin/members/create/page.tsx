import { redirect } from "next/navigation";

// This page redirects to the members page with create mode
export default function CreateMember() {
  redirect("/admin/members");
}