import { requireOrganizer } from "@/lib/session";
import { db } from "@/lib/db";
import PayoutSettingsForm from "@/components/dashboard/payout-settings-form";
import WorkspaceLayout from "@/components/dashboard/workspace-layout";

export default async function SettingsPage() {
  const session = await requireOrganizer();
  
  const currentUser = await db.query.user.findFirst({
    where: (u, { eq }) => eq(u.id, session.user.id)
  });

  return (
    <WorkspaceLayout 
      title="Global Settings" 
      subtitle="Configure your operational profile and settlement preferences."
    >
      <div className="max-w-3xl">
        <PayoutSettingsForm initialData={currentUser?.payoutDetails} />
      </div>
    </WorkspaceLayout>
  );
}
