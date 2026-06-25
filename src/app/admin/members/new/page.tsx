import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { NewMemberForm } from "./new-member-form";

export default async function NewMemberPage() {
  await requireUser();
  return (
    <AppShell>
      <NewMemberForm />
    </AppShell>
  );
}
