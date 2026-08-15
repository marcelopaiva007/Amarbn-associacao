import { listDocuments, listAssemblies } from "@/lib/db";
import { DocumentsClient } from "./documents-client";

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const [documents, assemblies] = await Promise.all([listDocuments(), listAssemblies()]);

  return <DocumentsClient initialDocuments={documents} initialAssemblies={assemblies} />;
}
