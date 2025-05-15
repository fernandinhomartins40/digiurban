
// App.tsx
import React, { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { appRoutes } from './routes';

function App() {
  useEffect(() => {
    console.log("[App] App component mounted");
    return () => {
      console.log("[App] App component unmounted");
    };
  }, []);

  // Use the routes directly instead of creating another RouterProvider
  const routing = useRoutes(appRoutes);
  
  return routing;
}

export default App;
