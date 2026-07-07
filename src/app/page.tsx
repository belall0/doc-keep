import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { getUsers } from "@/dal/users/queries";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage() {
  const currentUser = await getCurrentUser();
  if (currentUser) redirect("/projects");

  const users = await getUsers();
  const engineeringUsers = users.filter((u) => u.department === "Engineering");
  const marketingUsers = users.filter((u) => u.department === "Marketing");

  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoginForm
        engineeringUsers={engineeringUsers}
        marketingUsers={marketingUsers}
      />
    </div>
  );
}
