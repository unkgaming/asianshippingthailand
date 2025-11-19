import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// DELETE /api/users/[id] - Delete a user permanently
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only employees can delete users
    if (!session?.user || (session.user as any).role !== "employee") {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = await params;

    if (!userId) {
      return NextResponse.json({ ok: false, error: "User ID is required" }, { status: 400 });
    }

    // Prevent deleting yourself
    if ((session.user as any).id === userId) {
      return NextResponse.json({ ok: false, error: "Cannot delete your own account" }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 });
    }

    // Delete related records first (cascade might not be set up for all)
    await prisma.userConfig.deleteMany({ where: { userId } });
    await prisma.notification.deleteMany({ where: { userId } });
    await prisma.session.deleteMany({ where: { userId } });
    await prisma.account.deleteMany({ where: { userId } });

    // Finally delete the user
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ 
      ok: true, 
      message: "User deleted successfully" 
    });
  } catch (err: any) {
    console.error("Delete user error:", err);
    return NextResponse.json({ 
      ok: false, 
      error: err?.message ?? "Failed to delete user" 
    }, { status: 500 });
  }
}
