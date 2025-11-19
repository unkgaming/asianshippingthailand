import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignUpClient from "./sign-up-client";

export default async function SignUpPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) redirect("/");
  return <SignUpClient />;
}
