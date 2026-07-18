import { eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { DocumentTable, UserTable } from "@/drizzle/schema";

export async function getDocumentById(documentId: string) {
  const document = await db.query.DocumentTable.findFirst({
    where: eq(DocumentTable.id, documentId),
  });
  return document ?? null;
}

export async function getProjectDocuments(projectId: string) {
  return db
    .select({
      id: DocumentTable.id,
      title: DocumentTable.title,
      status: DocumentTable.status,
      isLocked: DocumentTable.isLocked,
      createdAt: DocumentTable.createdAt,
      creator: {
        id: UserTable.id,
        name: UserTable.name,
      },
    })
    .from(DocumentTable)
    .innerJoin(UserTable, eq(DocumentTable.creatorId, UserTable.id))
    .where(eq(DocumentTable.projectId, projectId))
    .orderBy(DocumentTable.createdAt);
}

export async function getDocumentWithUserInfo(documentId: string) {
  const document = await db.query.DocumentTable.findFirst({
    where: eq(DocumentTable.id, documentId),
    with: {
      creator: { columns: { name: true } },
      lastEditedBy: { columns: { name: true } },
    },
  });
  return document ?? null;
}
