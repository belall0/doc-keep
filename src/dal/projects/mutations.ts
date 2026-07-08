import { eq } from "drizzle-orm";

import { db } from "@/drizzle/db";
import { ProjectInsertData, ProjectTable, User } from "@/drizzle/schema";
import { AuthorizationError } from "@/lib/errors";

export async function createProject(user: User, data: ProjectInsertData) {
  // AUTH_CHECK:
  if (user.role !== "admin") throw new AuthorizationError();

  const [project] = await db
    .insert(ProjectTable)
    .values(data)
    .returning({ id: ProjectTable.id });

  return project;
}

export async function updateProject(
  user: User,
  projectId: string,
  data: Partial<ProjectInsertData>,
) {
  // AUTH_CHECK:
  if (user.role !== "admin") throw new AuthorizationError();

  const [updatedProject] = await db
    .update(ProjectTable)
    .set(data)
    .where(eq(ProjectTable.id, projectId))
    .returning();

  if (!updatedProject) throw new Error(`Project not found`);

  return updatedProject;
}

export async function deleteProject(user: User, projectId: string) {
  // AUTH_CHECK:
  if (user.role !== "admin") throw new AuthorizationError();

  await db.delete(ProjectTable).where(eq(ProjectTable.id, projectId));
}
