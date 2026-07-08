import { eq } from "drizzle-orm";

import { db } from "@/drizzle/db";
import { DocumentInsertData, DocumentTable, type User } from "@/drizzle/schema";
import { AuthorizationError } from "@/lib/errors";
import { getProjectById } from "@/dal/projects/queries";

export async function createDocument(user: User, data: DocumentInsertData) {
  // AUTH_CHECK:
  if (user.role !== "admin" && user.role !== "author")
    throw new AuthorizationError();

  const project = await getProjectById(user, data.projectId);
  if (!project) throw new AuthorizationError();

  const [document] = await db
    .insert(DocumentTable)
    .values(data)
    .returning({ id: DocumentTable.id });

  return document;
}

export async function updateDocument(
  user: User,
  documentId: string,
  data: Partial<DocumentInsertData>,
) {
  // AUTH_CHECK:
  if (user.role === "viewer") throw new AuthorizationError();

  const document = await db.query.DocumentTable.findFirst({
    where: eq(DocumentTable.id, documentId),
  });
  if (!document) throw new Error("Document not found");

  // AUTH_CHECK:
  const project = await getProjectById(user, document.projectId);
  if (!project) throw new AuthorizationError();

  const [updatedDocument] = await db
    .update(DocumentTable)
    .set(data)
    .where(eq(DocumentTable.id, documentId))
    .returning();

  return updatedDocument;
}

export async function deleteDocument(user: User, documentId: string) {
  // AUTH_CHECK:
  if (user.role !== "admin") throw new AuthorizationError();

  await db.delete(DocumentTable).where(eq(DocumentTable.id, documentId));
}
