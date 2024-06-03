import React, { createContext, useReducer, useContext, ReactNode, Dispatch } from 'react';

// Define the User type
export type User = {
  id: number;
  name: string;
  email: string;
};

// Define the state structure
type State = {
  users: User[];
};

// Define possible actions that can be dispatched
type Action =
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: number };

// Initial state of the application
const initialState: State = {
  users: [],
};

// Define the context type that includes state and dispatch function
type ContextType = {
  state: State;
  dispatch: Dispatch<Action>;
};

// Create the UserContext with initial values
const UserContext = createContext<ContextType>({
  state: initialState,
  dispatch: () => null as any, // Dummy dispatch function for initial context value
});

// Reducer function to handle state updates based on actions
const userReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_USER':
      return {
        ...state,
        users: [...state.users, action.payload], // Add a new user to the state
      };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? { ...user, ...action.payload } : user // Update an existing user
        ),
      };
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload), // Delete a user from the state
      };
    default:
      return state;
  }
};

// Props for the UserProvider component
interface UserProviderProps {
  children: ReactNode;
}

// UserProvider component to provide state and dispatch function through context
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState); // Initialize state and dispatch using useReducer

  return <UserContext.Provider value={{ state, dispatch }}>{children}</UserContext.Provider>;
};

// Custom hook to consume the UserContext and access state and dispatch function
export const useUserContext = () => useContext(UserContext);
