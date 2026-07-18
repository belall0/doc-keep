"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { documentSchema, type DocumentFormValues } from "@/dtos/documents";
import { tryFn } from "@/lib/helpers";
import {
  createDocument,
  deleteDocument,
  updateDocument,
} from "@/dal/documents/mutations";

export async function createDocumentAction(
  projectId: string,
  data: DocumentFormValues,
) {
  const user = await getCurrentUser();
  if (!user) return { message: "Not authenticated" };

  const result = documentSchema.safeParse(data);
  if (!result.success) return { message: "Invalid data" };

  const [error, document] = await tryFn(() =>
    createDocument({
      ...result.data,
      projectId,
      creatorId: user.id,
      lastEditedById: user.id,
    }),
  );

  if (error) return error;

  redirect(`/projects/${projectId}/documents/${document.id}`);
}

export async function updateDocumentAction(
  documentId: string,
  projectId: string,
  data: DocumentFormValues,
) {
  const user = await getCurrentUser();
  if (!user) return { message: "Not authenticated" };

  const result = documentSchema.safeParse(data);
  if (!result.success) return { message: "Invalid data" };

  const [error] = await tryFn(() =>
    updateDocument(documentId, {
      ...result.data,
      lastEditedById: user.id,
    }),
  );

  if (error) return error;

  redirect(`/projects/${projectId}/documents/${documentId}`);
}

export async function deleteDocumentAction(
  documentId: string,
  projectId: string,
) {
  const user = await getCurrentUser();
  if (!user) return { message: "Not authenticated" };

  const [error] = await tryFn(() => deleteDocument(documentId));

  if (error) return error;

  redirect(`/projects/${projectId}`);
}
