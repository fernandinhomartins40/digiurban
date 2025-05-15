// App.tsx
// Remover o QueryClientProvider duplicado e usar apenas o que está em AppProviders.tsx

import React, { useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { appRoutes } from './routes';
import { AppProviders } from './components/providers/AppProviders';

// Create router
const router = createBrowserRouter(appRoutes);

function App() {
  useEffect(() => {
    console.log("[App] App component mounted");
    return () => {
      console.log("[App] App component unmounted");
    };
  }, []);

  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}

export default App;
