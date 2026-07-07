"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/session";
import { projectSchema, type ProjectFormValues } from "@/dtos/projects";
import { tryFn } from "@/lib/helpers";
import {
  createProject,
  deleteProject,
  updateProject,
} from "@/dal/projects/mutations";
import type { User } from "@/drizzle/schema";

// DONE:
export async function createProjectAction(data: ProjectFormValues) {
  // AUTH_CHECK:
  const user: User | null = await getCurrentUser();
  if (!user) {
    return { message: "Not authenticated" };
  }

  const result = projectSchema.safeParse(data);
  if (!result.success) {
    return { message: "Invalid data" };
  }

  const [error, project] = await tryFn(() =>
    createProject(user, {
      ...result.data,
      ownerId: user.id,
      department: result.data.department || null,
    }),
  );
  if (error) {
    return error;
  }

  revalidatePath(`/projects/${project.id}`);
  return redirect(`/projects/${project.id}`);
}

// DONE:
export async function updateProjectAction(
  projectId: string,
  data: ProjectFormValues,
) {
  // AUTH_CHECK:
  const user: User | null = await getCurrentUser();
  if (!user) {
    return { message: "Not authenticated" };
  }

  const result = projectSchema.safeParse(data);
  if (!result.success) return { message: "Invalid data" };

  const [error] = await tryFn(() =>
    updateProject(user, projectId, result.data),
  );
  if (error) {
    return error;
  }

  revalidatePath(`/projects/${projectId}`);
  return redirect(`/projects/${projectId}`);
}

// DONE:
export async function deleteProjectAction(projectId: string) {
  // AUTH_CHECK:
  const user: User | null = await getCurrentUser();
  if (!user) {
    return { message: "Not authenticated" };
  }

  const [error] = await tryFn(() => deleteProject(user, projectId));
  if (error) {
    return error;
  }

  return redirect("/projects");
}
