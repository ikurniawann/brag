import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { SubmitClient } from "./submit-client";

export default async function SubmitPage() {
  await requireUser();
  return (
    <AppShell>
      <SubmitClient />
    </AppShell>
  );
}
