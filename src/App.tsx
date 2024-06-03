import React from 'react';
import { UserProvider } from './hooks/UserReducer';
import UserTable from './components/UserTable';

const App: React.FC = () => {
  return (
    <UserProvider>
      <div style={{ padding: '20px' }}>
        <h1>User Management</h1>
        <UserTable />
      </div>
    </UserProvider>
  );
};

export default App;
