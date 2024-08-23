import CustomModal from '../modal';

interface ModalGraphHelpProps {
  open: boolean;
  onClose: () => void;
}

export default function ModalGraphHelp({ open, onClose }: ModalGraphHelpProps) {
  return (
    <CustomModal size={'7xl'} open={open} onClose={onClose} title="Understanding Decision Graphs">
      <div className="space-y-6">
        <section>
          <h3 className="text-2xl font-bold mb-2">What is a Decision Graph?</h3>
          <p className="text-lg">
            A decision graph is a visual representation of questions you want to ask a user and how you want to handle
            the conversation flow based on their answers. It provides an opportunity to create a structured conversation
            flow that can be used to gather information from your users, while still adhering to the principles of a
            natural conversation.
          </p>
        </section>

        <section>
          <h3 className="text-2xl font-bold mb-2">How to Use the Decision Graph Tool</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              Start by adding nodes to your graph by dragging an edge from the 'Start' node. Once you release, a new
              node menu will appear.
            </li>
            <li>Connect nodes by dragging from the output handle of one node to the input handle of another.</li>
            <li>Edit nodes by directly interacting with them to add text or other content.</li>
            <li>Use the 'Generate Graph' button to automatically create a basic graph structure.</li>
            <li>Clear the entire graph using the 'Clear Graph' button if you want to start over.</li>
          </ol>
        </section>

        <section>
          <h3 className="text-2xl font-bold mb-2">Node Types</h3>
          <p className="bg-blue-100 p-4 mb-4 rounded-lg text-blue-800">
            <strong>Tip:</strong> Knowing when to use each node type can help you create a more effective conversation
            flow and help keep users engaged.
          </p>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">Node Type</th>
                <th className="border border-gray-300 p-2 text-left">Description</th>
                <th className="border border-gray-300 p-2 text-left">Use Case</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2 font-semibold">Conditional</td>
                <td className="border border-gray-300 p-2">
                  A node where users can write a message to direct users to a different node based on certain
                  conditions.
                </td>
                <td className="border border-gray-300 p-2">
                  Use when you need to branch the conversation based on user input or other factors.
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-semibold">Conversation</td>
                <td className="border border-gray-300 p-2">
                  Where a user can create a question for the end-user to respond to.
                </td>
                <td className="border border-gray-300 p-2">
                  Use to gather specific information from the user or prompt for a response.
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-semibold">Information</td>
                <td className="border border-gray-300 p-2">
                  Where a user can provide explanations or additional context.
                </td>
                <td className="border border-gray-300 p-2">
                  Use to give users important information or instructions without requiring a response.
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-semibold">Start/End</td>
                <td className="border border-gray-300 p-2">
                  Nodes that indicate the beginning and conclusion of the decision graph.
                </td>
                <td className="border border-gray-300 p-2">
                  Use to clearly mark the entry and exit points of your conversation flow.
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </CustomModal>
  );
}
