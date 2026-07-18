import { eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { DocumentInsertData, DocumentTable } from "@/drizzle/schema";

export async function createDocument(data: DocumentInsertData) {
  const [document] = await db
    .insert(DocumentTable)
    .values(data)
    .returning({ id: DocumentTable.id });

  return document;
}

export async function updateDocument(
  documentId: string,
  data: Partial<DocumentInsertData>,
) {
  const document = await db.query.DocumentTable.findFirst({
    where: eq(DocumentTable.id, documentId),
  });
  if (!document) throw new Error("Document not found");

  const [updatedDocument] = await db
    .update(DocumentTable)
    .set(data)
    .where(eq(DocumentTable.id, documentId))
    .returning();

  return updatedDocument;
}

export async function deleteDocument(documentId: string) {
  await db.delete(DocumentTable).where(eq(DocumentTable.id, documentId));
}
