import React from 'react';

interface NodeResponse {
  nodeId: string;
  data: any
}

const InquiryPage: React.FC = () => {
  const [history, setHistory] = React.useState<NodeResponse[]>([]);

  return (<></>);
};

export default InquiryPage;
