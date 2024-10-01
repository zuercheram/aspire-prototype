import React, { PropsWithChildren, useContext, useMemo } from "react";
import { ScrollTableStore } from "./ScrollTableStore";

const ScrollTableStoreContext = React.createContext<ScrollTableStore>(
  {} as ScrollTableStore
);

export const ScrollTableStoreContextProvider = ({
  children,
}: PropsWithChildren) => {
  const store = useMemo(() => new ScrollTableStore(), []);

  return (
    <ScrollTableStoreContext.Provider value={store}>
      {children}
    </ScrollTableStoreContext.Provider>
  );
};

export const useScrollTableStore = () => useContext(ScrollTableStoreContext);
