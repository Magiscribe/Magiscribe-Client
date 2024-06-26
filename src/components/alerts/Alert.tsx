import { Alert } from '../../providers/AlertProvider';

interface AlertProps {
  alert: Alert;
  unmountSelf: () => void;
}

export function AlertComponent({ alert, unmountSelf }: AlertProps) {
  let color = '';
  switch (alert.type) {
    case 'error':
      color = 'bg-red-50 text-red-700';
      break;
    case 'success':
      color = 'bg-green-50 text-green-700';
      break;
    case 'warning':
      color = 'bg-yellow-50 text-yellow-700';
      break;
    default:
      color = 'bg-blue-50 text-blue-700';
      break;
  }

  return (
    <div className={`${color} shadow-xl rounded-lg p-4`}>
      <div className="flex items-center">
        <div className="ml-3">
          <p className="leading-5 font-medium">{alert.message}</p>
        </div>
        <button
          onClick={unmountSelf}
          className="mx-2 focus:outline-none"
        ></button>
      </div>
    </div>
  );
}
