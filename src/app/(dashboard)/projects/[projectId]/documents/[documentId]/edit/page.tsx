import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { getProjectById } from "@/dal/projects/queries";
import { getDocumentById } from "@/dal/documents/queries";
import { DocumentForm } from "@/components/document-form";
import { getCurrentUser } from "@/lib/session";

export default async function EditDocumentPage({
  params,
}: PageProps<"/projects/[projectId]/documents/[documentId]/edit">) {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const { projectId, documentId } = await params;

  const document = await getDocumentById(documentId);
  if (!document) notFound();

  const project = await getProjectById(projectId);
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/projects/${projectId}/documents/${documentId}`}>
            <ArrowLeftIcon className="size-4" />
            <span className="sr-only">Back to document</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Document</h1>
          <p className="text-muted-foreground">in {project.name}</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <DocumentForm document={document} projectId={projectId} />
      </div>
    </div>
  );
}
