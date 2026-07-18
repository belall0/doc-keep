import { getCurrentUser } from "@/lib/session";
import { projectSchema, type ProjectFormValues } from "@/dtos/projects";
import {
  createProject,
  deleteProject,
  updateProject,
} from "@/dal/projects/mutations";
import { AuthorizationError } from "@/lib/errors";

export async function createProjectService(data: ProjectFormValues) {
  const user = await getCurrentUser();
  if (user == null) throw new Error("Not authenticated");

  // PERMISSION:
  if (user.role !== "admin") throw new AuthorizationError();

  const result = projectSchema.safeParse(data);
  if (!result.success) throw new Error("Invalid data");

  return createProject({
    ...result.data,
    ownerId: user.id,
    department: result.data.department || null,
  });
}

export async function updateProjectService(
  projectId: string,
  data: ProjectFormValues,
) {
  const user = await getCurrentUser();
  if (user == null) throw new Error("Not authenticated");

  // PERMISSION:
  if (user.role !== "admin") throw new AuthorizationError();

  const result = projectSchema.safeParse(data);
  if (!result.success) throw new Error("Invalid data");

  return updateProject(projectId, data);
}

export async function deleteProjectService(projectId: string) {
  const user = await getCurrentUser();
  if (user == null) throw new Error("Not authenticated");

  // PERMISSION:
  if (user.role !== "admin") throw new AuthorizationError();

  return deleteProject(projectId);
}
