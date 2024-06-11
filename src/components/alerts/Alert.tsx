import { Alert } from "../../providers/AlertProvider";

interface AlertProps {
  alert: Alert;
  unmountSelf: () => void;
}

export function AlertComponent({ alert, unmountSelf }: AlertProps) {
  const color = "bg-green-50 text-green-700";

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
