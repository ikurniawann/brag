import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { NewBoosterForm } from "./new-booster-form";

export default async function NewBoosterPage() {
  await requireUser();
  return (
    <AppShell>
      <NewBoosterForm />
    </AppShell>
  );
}
