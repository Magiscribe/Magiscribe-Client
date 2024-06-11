import { useContext } from "react";
import { AlertContext } from "../providers/AlertProvider";

export const useAlertContext = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlertContext must be used within an AlertProvider");
  }
  return context;
};

export const useAlert = () => useAlertContext().alerts;

export const useAddAlert = () => useAlertContext().addAlert;

export const useRemoveAlert = () => useAlertContext().removeAlert;
