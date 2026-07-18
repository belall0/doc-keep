import { eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { ProjectInsertData, ProjectTable } from "@/drizzle/schema";

export async function createProject(data: ProjectInsertData) {
  const [project] = await db
    .insert(ProjectTable)
    .values(data)
    .returning({ id: ProjectTable.id });

  return project;
}

export async function updateProject(
  projectId: string,
  data: Partial<ProjectInsertData>,
) {
  const [updatedProject] = await db
    .update(ProjectTable)
    .set(data)
    .where(eq(ProjectTable.id, projectId))
    .returning();

  if (!updatedProject) throw new Error(`Project not found`);

  return updatedProject;
}

export async function deleteProject(projectId: string) {
  await db.delete(ProjectTable).where(eq(ProjectTable.id, projectId));
}
