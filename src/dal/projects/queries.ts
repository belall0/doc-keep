import { eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { ProjectTable } from "@/drizzle/schema";

export async function getAllProjects({ ordered } = { ordered: false }) {
  return db.query.ProjectTable.findMany({
    orderBy: ordered ? ProjectTable.name : undefined,
  });
}

export async function getProjectById(projectId: string) {
  return db.query.ProjectTable.findFirst({
    where: eq(ProjectTable.id, projectId),
  });
}
