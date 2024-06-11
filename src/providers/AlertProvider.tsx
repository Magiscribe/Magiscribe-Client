import { AnimatePresence, motion } from "framer-motion";
import React, { createContext, useState } from "react";
import { AlertComponent } from "../components/alerts/Alert";
import { useAlertContext } from "../hooks/AlertHooks";

export type Alert = {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
};

interface AlertContextProps {
  alerts: Alert[];
  addAlert: (message: string, type: Alert["type"], timeout?: number) => void;
  removeAlert: (id: string) => void;
}

export const AlertContext = createContext<AlertContextProps | undefined>(
  undefined,
);

const AlertWrapper = ({ children }: { children: React.ReactNode }) => {
  const { alerts, removeAlert } = useAlertContext();

  return (
    <>
      <div className="flex fixed bottom-0 left-0 z-50 p-4">
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence>
            {alerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 100, rotate: 90 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, height: 0 }}
              >
                <AlertComponent
                  alert={alert}
                  unmountSelf={() => removeAlert(alert.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      {children}
    </>
  );
};

const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addAlert = (message: string, type: Alert["type"], timeout = 5000) => {
    const alertId = Math.random().toString(36).substring(2, 9);
    setAlerts((alerts) => [...alerts, { id: alertId, message, type }]);

    setTimeout(() => {
      removeAlert(alertId);
    }, timeout);
  };

  const removeAlert = (id: string) => {
    setAlerts((alerts) => alerts.filter((alert) => alert.id !== id));
  };

  const value = { alerts, addAlert, removeAlert };

  return (
    <AlertContext.Provider value={value}>
      <AlertWrapper>{children}</AlertWrapper>
    </AlertContext.Provider>
  );
};

export default AlertProvider;
