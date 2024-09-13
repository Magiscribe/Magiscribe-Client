import { Handle, HandleProps, useHandleConnections } from '@xyflow/react';

interface CustomHandleProps extends HandleProps {
  connectionCount: number;
}

const CustomHandle = (props: CustomHandleProps) => {
  const connections = useHandleConnections({
    type: props.type,
  });

  // Remove connectionCount prop from the Handle component
  const { connectionCount, ...rest } = props;

  return (
    <Handle
      {...rest}
      isConnectable={connections.length < connectionCount}
      className={connections.length < connectionCount ? 'w-4 h-4 !bg-teal-500' : 'opacity-0'}
    />
  );
};

export default CustomHandle;
