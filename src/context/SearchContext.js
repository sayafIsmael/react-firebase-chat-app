import { createContext, useReducer } from "react";

export const SearchContext = createContext();

export const SearchContextProvider = ({ children }) => {
  const INITIAL_STATE = {
    searchString: "",
  };

  //On dispatch CHANGE_TEXT action
  const searchtReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_TEXT":
        return {
          searchString: action.payload,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(searchtReducer, INITIAL_STATE);

  return (
    <SearchContext.Provider value={{ username: state.searchString, dispatchSearch: dispatch }}>
      {children}
    </SearchContext.Provider>
  );
};
