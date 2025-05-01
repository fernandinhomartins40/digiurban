import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { AuthLayout } from "./components/layout/AuthLayout";
import LoginPage from "./pages/auth/Login";
import RegisterPage from "./pages/auth/Register";
import ForgotPasswordPage from "./pages/auth/ForgotPassword";
import ResetPasswordPage from "./pages/auth/ResetPassword";
import DashboardPage from "./pages/admin/Dashboard";
import RequireAuth from "./components/auth/RequireAuth";
import GabineteIndexPage from "./pages/admin/gabinete";
import DirectRequests from "./pages/admin/gabinete/DirectRequests";
import EducacaoIndexPage from "./pages/admin/educacao";
import SaudeIndexPage from "./pages/admin/saude";
import AdministracaoIndexPage from "./pages/admin/administracao";
import ServicosIndexPage from "./pages/admin/servicos";
import FinancasIndexPage from "./pages/admin/financas";
import ObrasIndexPage from "./pages/admin/obras";
import MeioAmbienteIndexPage from "./pages/admin/meioambiente";
import CorreioIndexPage from "./pages/admin/correio";
import ChatIndexPage from "./pages/admin/chat";
import ProfilePage from "./pages/admin/profile";
import UsersPage from "./pages/admin/administracao/users";
import PublicPoliciesPage from "./pages/admin/gabinete/PublicPolicies";
import StrategicProgramsPage from "./pages/admin/gabinete/StrategicPrograms";
import PurchaseRequestsPage from "./pages/admin/financas/PurchaseRequests";
import HRRequestsPage from "./pages/admin/administracao/HRRequests";
import MailDocumentsPage from "./pages/admin/correio/MailDocuments";
import TFDIndexPage from "./pages/admin/saude/tfd";
import AssistanceIndexPage from './pages/admin/assistencia/index';
import BenefitsPage from './pages/admin/assistencia/beneficios/index';
import SocialProgramsPage from './pages/admin/assistencia/programas/index';
import CrasCreasPage from './pages/admin/assistencia/cras/index';
import VulnerableFamiliesPage from './pages/admin/assistencia/familias/index';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
      </Route>

      <Route
        element={
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />

        {/* Gabinete routes */}
        <Route path="admin/gabinete" element={<GabineteIndexPage />} />
        <Route path="admin/gabinete/solicitacoes" element={<DirectRequests />} />
        <Route path="admin/gabinete/politicas-publicas" element={<PublicPoliciesPage />} />
        <Route path="admin/gabinete/programas-estrategicos" element={<StrategicProgramsPage />} />

        {/* Educação routes */}
        <Route path="admin/educacao" element={<EducacaoIndexPage />} />

        {/* Saúde routes */}
        <Route path="admin/saude" element={<SaudeIndexPage />} />
        <Route path="admin/saude/tfd" element={<TFDIndexPage />} />

        {/* Assistência Social routes */}
        <Route path="admin/assistencia" element={<AssistenciaIndexPage />} />
        <Route path="admin/assistencia/beneficios" element={<BenefitsPage />} />
        <Route path="admin/assistencia/programas" element={<SocialProgramsPage />} />
        <Route path="admin/assistencia/cras" element={<CrasCreasPage />} />
        <Route path="admin/assistencia/familias" element={<VulnerableFamiliesPage />} />

        {/* Administração routes */}
        <Route path="admin/administracao" element={<AdministracaoIndexPage />} />
        <Route path="admin/administracao/users" element={<UsersPage />} />
        <Route path="admin/administracao/hr-requests" element={<HRRequestsPage />} />

        {/* Serviços routes */}
        <Route path="admin/servicos" element={<ServicosIndexPage />} />

        {/* Finanças routes */}
        <Route path="admin/financas" element={<FinancasIndexPage />} />
         <Route path="admin/financas/purchase-requests" element={<PurchaseRequestsPage />} />

        {/* Obras routes */}
        <Route path="admin/obras" element={<ObrasIndexPage />} />

        {/* Meio Ambiente routes */}
        <Route path="admin/meioambiente" element={<MeioAmbienteIndexPage />} />

        {/* Correio routes */}
        <Route path="admin/correio" element={<CorreioIndexPage />} />
         <Route path="admin/correio/mail-documents" element={<MailDocumentsPage />} />

        {/* Chat routes */}
        <Route path="admin/chat" element={<ChatIndexPage />} />
      </Route>
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
