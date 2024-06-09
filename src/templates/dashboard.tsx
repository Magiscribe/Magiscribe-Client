import {
  Protect,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  useSession,
} from "@clerk/clerk-react";
import { Outlet } from "react-router-dom";
import LinkCard from "../components/card";

export default function DashboardTemplate() {
  const { session } = useSession();

  return (
    <Protect
      condition={() =>
        session?.user.organizationMemberships[0].role === "org:admin"
      }
      fallback={
        <>
          <SignedIn>
            <div className="container max-w-12xl mx-auto px-4 py-8">
              <p className="text-3xl font-bold">
                You do not have permission to view this page.
              </p>
            </div>
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </>
      }
    >
      <div className="container max-w-12xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
          <LinkCard
            image="https://cdn.pixabay.com/photo/2019/04/26/23/07/duisburg-4158910_1280.jpg"
            title="Agents"
            description="View and manage your agents."
            to="/dashboard/agents"
            gradient="purple"
            key={1}
          />
          <LinkCard
            image="https://cdn.pixabay.com/photo/2019/04/26/23/07/duisburg-4158910_1280.jpg"
            title="Capabilities"
            description="What can your agents do?"
            to="/dashboard/capabilities"
            gradient="blue"
            key={1}
          />
        </div>
        <Outlet />
      </div>
    </Protect>
  );
}
