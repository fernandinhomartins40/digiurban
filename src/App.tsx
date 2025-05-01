
import {
  Route,
  createRoutesFromElements,
  createBrowserRouter,
  Routes,
} from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { AuthLayout } from "@/components/layout/AuthLayout";
import LoginPage from "@/pages/auth/Login";
import RegisterPage from "@/pages/auth/Register";
import ForgotPasswordPage from "@/pages/auth/ForgotPassword";
import ResetPasswordPage from "@/pages/auth/ResetPassword";
import DashboardPage from "@/pages/admin/Dashboard";
import RequireAuth from "@/components/auth/RequireAuth";
import AssistenciaIndexPage from './pages/admin/assistencia/index';
import BenefitsPage from './pages/admin/assistencia/beneficios/index';
import SocialProgramsPage from './pages/admin/assistencia/programas/index';
import CrasCreasPage from './pages/admin/assistencia/cras/index';
import VulnerableFamiliesPage from './pages/admin/assistencia/familias/index';
import EducacaoIndexPage from "./pages/admin/educacao";
import SaudeIndexPage from "./pages/admin/saude";
import AdministracaoIndexPage from "./pages/admin/administracao";
import TFDIndexPage from "./pages/admin/saude/tfd";
import ObrasIndexPage from "./pages/admin/obras";
import CorreioIndexPage from "./pages/admin/correio";
import ChatIndexPage from "./pages/admin/chat";
import ProfilePage from "./pages/admin/profile";
import FinancasIndexPage from "./pages/admin/financas";
import ServicosIndexPage from "./pages/admin/servicos";
import UsersPage from "./pages/admin/administracao/users";
import GabineteIndexPage from "./pages/admin/gabinete/index";
import AppointmentScheduler from "./pages/admin/gabinete/AppointmentScheduler";
import DirectRequests from "./pages/admin/gabinete/DirectRequests";
import PublicPoliciesPage from "./pages/admin/gabinete/PublicPolicies";
import StrategicProgramsPage from "./pages/admin/gabinete/StrategicPrograms";
import MeioAmbienteIndexPage from "./pages/admin/meioambiente";
import HRRequestsPage from "./pages/admin/administracao/HRRequests";
import PurchaseRequestsPage from "./pages/admin/financas/PurchaseRequests";
import MailDocumentsPage from "./pages/admin/correio/MailDocuments";
import ComprasPage from "./pages/admin/administracao/compras/index";

function App() {
  return (
    <Routes>
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
          <Route path="admin/gabinete/agendamentos" element={<AppointmentScheduler />} />
          <Route path="admin/gabinete/solicitacoes" element={<DirectRequests />} />
          <Route path="admin/gabinete/politicas" element={<PublicPoliciesPage />} />
          <Route path="admin/gabinete/programas" element={<StrategicProgramsPage />} />

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
          <Route path="admin/administracao/compras" element={<ComprasPage />} />

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
    </Routes>
  );
}

export default App;
