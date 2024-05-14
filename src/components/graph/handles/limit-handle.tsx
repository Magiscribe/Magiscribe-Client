import { Handle, HandleProps, useHandleConnections } from '@xyflow/react';

interface CustomHandleProps extends HandleProps {
  connectionCount?: number;
}

const CustomHandle = (props: CustomHandleProps) => {
  const { connectionCount, ...rest } = props;

  const connections = useHandleConnections({
    type: props.type,
  });

  const isConnectable = connectionCount == null || connections.length < connectionCount;

  return (
    <Handle {...rest} isConnectable={isConnectable} className={isConnectable ? 'w-4 h-4 bg-green-500!' : 'opacity-0'} />
  );
};

export default CustomHandle;
