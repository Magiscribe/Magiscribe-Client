import { Handle, HandleProps, useHandleConnections } from '@xyflow/react';

interface CustomHandleProps extends HandleProps {
  limit?: number;
}

const CustomHandle = (props: CustomHandleProps) => {
  const connections = useHandleConnections({
    type: props.type,
  });

  // Remove connectionCount prop from the Handle component
  const { limit, ...rest } = props;

  const isConnectable = limit == undefined || connections.length < limit;

  return (
    <Handle
      {...rest}
      isConnectable={isConnectable}
      className={isConnectable ? 'w-4 h-4 !bg-green-500' : 'opacity-0'}
    />
  );
};

export default CustomHandle;