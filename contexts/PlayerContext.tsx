// contexts/TabBarHeightContext.tsx
import { createContext, useContext, useState } from 'react';

const TabBarHeightContext = createContext<{
  height: number;
  setHeight: (h: number) => void;
}>({
  height: 0,
  setHeight: () => {},
});

export const TabBarHeightProvider = ({ children }: { children: React.ReactNode }) => {
  const [height, setHeight] = useState(0);
  return (
    <TabBarHeightContext.Provider value={{ height, setHeight }}>
      {children}
    </TabBarHeightContext.Provider>
  );
};

export const useTabBarHeight = () => useContext(TabBarHeightContext);
