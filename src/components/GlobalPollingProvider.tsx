import React, {createContext, useContext, ReactNode} from "react";
import {useGlobalPolling} from "@/hooks/useGlobalPolling";

interface GlobalPollingContextType {
  isPolling: boolean;
  currentJob: any;
  tasks: any[];
  startPolling: (jobId: string) => void;
  stopPolling: () => void;
}

const GlobalPollingContext = createContext<
  GlobalPollingContextType | undefined
>(undefined);

interface GlobalPollingProviderProps {
  children: ReactNode;
}

export const GlobalPollingProvider: React.FC<GlobalPollingProviderProps> = ({
  children,
}) => {
  const {isPolling, currentJob, tasks, startPolling, stopPolling} =
    useGlobalPolling();

  return (
    <GlobalPollingContext.Provider
      value={{isPolling, currentJob, tasks, startPolling, stopPolling}}
    >
      {children}
    </GlobalPollingContext.Provider>
  );
};

export const useGlobalPollingContext = () => {
  const context = useContext(GlobalPollingContext);
  if (context === undefined) {
    throw new Error(
      "useGlobalPollingContext must be used within a GlobalPollingProvider",
    );
  }
  return context;
};

export default GlobalPollingProvider;
