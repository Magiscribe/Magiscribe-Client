import { NodeVisitData, TabProps } from '@/types/conversation';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useMemo, useState } from 'react';

const PerResponseTab: React.FC<TabProps> = ({ data }) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const { nodeVisitData = [], graph } = data;
  const usersPerPage = 42;

  if (!nodeVisitData.length) return <div className="p-4">No data available</div>;

  const nodesMap = useMemo(
    () => Object.fromEntries((graph?.nodes || []).map((node) => [node.id, node])),
    [graph?.nodes],
  );

  const renderNodeContent = (node: NodeVisitData) => {
    if (node?.data?.response) {
      console.log(node.data);
      const title = node.data.text;
      const responseText = node.data.response.text;
      const ratings = node.data.response.ratings;

      return (
        <>
          <p className="font-semibold text-black">
            {node.id}. {title}
          </p>
          <hr className="my-2" />
          <p className="text-black">
            {responseText && <span>{responseText}</span>}
            {ratings?.length && ratings?.length > 0 && (
              <span>
                {responseText ? ' - ' : ''}
                {ratings.join(', ')}
              </span>
            )}
          </p>
        </>
      );
    }
    return null;
  };

  const totalPages = Math.ceil(nodeVisitData.length / usersPerPage);
  const displayedUsers = nodeVisitData.slice(currentPage * usersPerPage, (currentPage + 1) * usersPerPage);

  return (
    <div className="bg-white px-4 py-8 rounded-2xl shadow-xl text-slate-700">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Per Response</h2>
      </div>
      <div className="my-4">
        <h2 className="font-bold mb-2">Select User</h2>
        <div className="grid grid-cols-4 sm:grid-col-3 lg:grid-cols-4 gap-2">
          {displayedUsers.map(({ id, userId }) => (
            <button
              key={`${id}-${userId}`}
              onClick={() => setSelectedUser((prev) => (prev === id ? null : (id as string)))}
              className={`p-2 text-sm rounded-md ${
                selectedUser === id ? 'bg-blue-500 text-white' : 'bg-slate-200 text-black'
              }`}
            >
              {userId || 'Unknown'}
            </button>
          ))}
        </div>
        {nodeVisitData.length > usersPerPage && (
          <div className="flex justify-end mt-4 space-x-2">
            {[faChevronLeft, faChevronRight].map((icon, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage((prev) => Math.max(0, Math.min(totalPages - 1, prev + (index ? 1 : -1))))}
                disabled={index ? currentPage === totalPages - 1 : currentPage === 0}
                className="p-2 border-2 border-white rounded-full disabled:opacity-50"
              >
                <FontAwesomeIcon icon={icon} />
              </button>
            ))}
          </div>
        )}
      </div>
      <div>
        {selectedUser && (
          <h2 className="font-bold mb-2">
            User Response <> | {selectedUser}</>
          </h2>
        )}
        {selectedUser &&
          nodeVisitData
            .find((u) => u.id === selectedUser)
            ?.data?.map((node, i) => {
              const graphNode = nodesMap[node.id];
              if (graphNode?.type === 'conversation') {
                return (
                  <div key={i} className="mb-4 p-4 bg-slate-200 rounded-2xl">
                    {renderNodeContent(node)}
                  </div>
                );
              }
              return null;
            })}
      </div>
    </div>
  );
};

export default PerResponseTab;
