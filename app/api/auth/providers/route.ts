import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

export async function GET() {
  // Return the list of configured providers
  const providers = authOptions.providers?.map((provider) => {
    return {
      id: provider.id,
      name: provider.name,
      type: provider.type,
    };
  }) || [];

  return Response.json(providers);
}
