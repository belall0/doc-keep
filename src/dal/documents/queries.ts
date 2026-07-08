import { db } from "@/drizzle/db";
import { DocumentTable, User, UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { getProjectById } from "../projects/queries";

export async function getDocumentById(user: User, documentId: string) {
  const document = await db.query.DocumentTable.findFirst({
    where: eq(DocumentTable.id, documentId),
  });
  if (!document) return null;

  // AUTH_CHECK:
  const project = await getProjectById(user, document.projectId);
  if (!project) return null;

  return document;
}

export async function getProjectDocuments(user: User, projectId: string) {
  // AUTH_CHECK:
  const project = await getProjectById(user, projectId);
  if (!project) return null;

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

export async function getDocumentWithUserInfo(user: User, documentId: string) {
  // AUTH_CHECK:
  const hasAccess = await getDocumentById(user, documentId);
  if (!hasAccess) return null;

  return db.query.DocumentTable.findFirst({
    where: eq(DocumentTable.id, documentId),
    with: {
      creator: { columns: { name: true } },
      lastEditedBy: { columns: { name: true } },
    },
  });
}
