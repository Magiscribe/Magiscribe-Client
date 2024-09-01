import LinkCard from '@/components/cards/card';
import { useSetTitle } from '@/hooks/title-hook';
import { useSession } from '@clerk/clerk-react';

export default function DashboardPage() {
  useSetTitle()('Dashboard');

  const { session } = useSession();
  const isAdmin = session?.user.organizationMemberships[0]?.role === 'org:admin';

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 my-8">
        {isAdmin && (
          <LinkCard
            title="Agent Lab"
            description="Build and manage AI agents."
            to="/dashboard/agent-lab"
            gradient="blue"
          />
        )}
        <LinkCard
          title="Inquiry Builder"
          description="Create complex conversational flows to capture user feedback."
          to="/dashboard/inquiry"
          gradient="purple"
        />
      </div>
    </>
  );
}
