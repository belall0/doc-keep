import { and, eq, isNull, or } from "drizzle-orm";

import { db } from "@/drizzle/db";
import { ProjectTable, User } from "@/drizzle/schema";

// AUTH_CHECK:
export async function getAllProjects(
  user: User,
  { ordered } = { ordered: false },
) {
  return db.query.ProjectTable.findMany({
    where: userWhereClause(user),
    orderBy: ordered ? ProjectTable.name : undefined,
  });
}

// AUTH_CHECK:
export async function getProjectById(user: User, id: string) {
  return db.query.ProjectTable.findFirst({
    where: and(eq(ProjectTable.id, id), userWhereClause(user)),
  });
}

// AUTH_CHECK:
function userWhereClause(user: Pick<User, "role" | "department">) {
  const role = user.role;
  switch (role) {
    case "author":
    case "viewer":
    case "editor":
      return or(
        eq(ProjectTable.department, user.department),
        isNull(ProjectTable.department),
      );
    case "admin":
      return undefined; // no filter — admins see all projects
    default:
      throw new Error(`Unhandled user role: ${role satisfies never}`);
  }
}
