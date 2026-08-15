import { listMembers } from "@/lib/db";
import { MembersClient } from "./members-client";

export const dynamic = "force-dynamic";

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const params = await searchParams;
  const search = params.q || "";
  const status = params.status || "TODOS";
  const members = await listMembers(search, status);

  return <MembersClient initialMembers={members} initialSearch={search} initialStatus={status} />;
}
