import React from 'react';

interface UserActon {
  type: string;
  data?: any;
}

interface UserState {
  username: string;
}

interface UserSessionState {
  data?: UserState;
  dispatch?: React.Dispatch<UserActon>;
  initialized: boolean;
  loggedIn: boolean;
}

interface ProviderProps {
  children: React.ReactNode;
}

const initialState: UserSessionState = {
  initialized: false,
  loggedIn: false,
};

const Context = React.createContext<UserSessionState>(initialState);

const LOCALSTORAGE_SESSION_KEY = 'gimbal-example-login';

const reducer = (state: UserSessionState, action: UserActon): UserSessionState => {
  switch (action.type) {
    case 'init':
      if (state.initialized) {
        throw new Error('session service already initialized');
      }

      const login = localStorage.getItem(LOCALSTORAGE_SESSION_KEY);

      return {
        ...state,
        initialized: true,
        dispatch: action.data.dispatch,
        loggedIn: Boolean(login),
      };
    case 'login':
      localStorage.setItem(LOCALSTORAGE_SESSION_KEY, JSON.stringify(action.data));

      return {
        ...state,
        data: action.data,
        loggedIn: true,
      };
    case 'logout':
      localStorage.removeItem(LOCALSTORAGE_SESSION_KEY);

      return {
        ...state,
        data: undefined,
        loggedIn: false,
      };
    default:
      throw new Error('Unhandled action type in session reducer');
  }
};

const Provider = ({ children }: ProviderProps) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    dispatch({
      type: 'init',
      data: {
        dispatch,
      },
    });
  }, []);

  return <Context.Provider value={state}>{children}</Context.Provider>;
};

export default Provider;

export const useSession = () => React.useContext(Context);
