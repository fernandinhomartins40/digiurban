
import { BrowserRouter } from "react-router-dom";
import { AppProviders } from "@/components/providers/AppProviders";
import { appRoutes } from "./routes";
import { useRoutes } from "react-router-dom";

// AppRoutes component to use the useRoutes hook
const AppRoutes = () => {
  const routes = useRoutes(appRoutes);
  return routes;
};

function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </BrowserRouter>
  );
}

export default App;
