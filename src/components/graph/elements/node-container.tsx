import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

type NodeContainerProps = {
  title: string;
  faIcon: IconDefinition;
  id: string;
  children: React.ReactNode;
};

const NodeContainer = ({ title, faIcon, id, children }: NodeContainerProps) => (
  <div className="px-4 py-2 shadow-md rounded-3xl bg-white border-2 border-stone-400 w-96 shadow-xl">
    <div className="flex items-center">
      <FontAwesomeIcon icon={faIcon} className="mr-2 text-blue-600" />
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      <p className="ml-2 text-sm text-gray-500">#{id}</p>
    </div>
    {children}
  </div>
);

export default NodeContainer;
