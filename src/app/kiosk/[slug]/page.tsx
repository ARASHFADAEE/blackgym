import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { KioskClient } from "@/components/kiosk/kiosk-client";

export default async function BranchKioskPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const branch = await prisma.branch.findUnique({ where: { slug, status: "ACTIVE" } });
  if (!branch) notFound();

  return <KioskClient branchId={branch.id} branchName={branch.name} />;
}
