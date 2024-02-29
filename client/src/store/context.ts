import { createContext } from "react";

interface ContextType {
  ID: string | null;
  setID: React.Dispatch<React.SetStateAction<string | null>>;
  oppID: string | null;
  setOppID: React.Dispatch<React.SetStateAction<string | null>>;
}

const defaultState = {
  ID: null,
  setID: () => {},
  oppID: null,
  setOppID: () => {},
};

export const ContextID = createContext<ContextType>(defaultState);
