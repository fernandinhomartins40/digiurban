
// App.tsx
import React, { useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { appRoutes } from './routes';

// Create router
const router = createBrowserRouter(appRoutes);

function App() {
  useEffect(() => {
    console.log("[App] App component mounted");
    return () => {
      console.log("[App] App component unmounted");
    };
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
