import { Outlet } from 'react-router-dom';
import LinkCard from '../components/card';
import { useSetTitle } from '../hooks/TitleHook';

export default function AgentLabTemplate() {
  useSetTitle()('Agent Lab');

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 my-8">
        <LinkCard
          title="Agents"
          description="View and manage your agents."
          to="/dashboard/agent-lab/agents"
          gradient="orange"
          isActive={isActive('agents')}
        />
        <LinkCard
          title="Capabilities"
          description="What can your agents do?"
          to="/dashboard/agent-lab/capabilities"
          gradient="green"
          isActive={isActive('capabilities')}
        />
        <LinkCard
          title="Prompts"
          description="Create and manage prompts."
          to="/dashboard/agent-lab/prompts"
          gradient="purple"
          isActive={isActive('prompts')}
        />
        <LinkCard
          title="Playground"
          description="See things go brrrr."
          to="/dashboard/agent-lab/playground"
          gradient="blue"
          isActive={isActive('playground')}
        />
      </div>
      <Outlet />
    </>
  );
}
