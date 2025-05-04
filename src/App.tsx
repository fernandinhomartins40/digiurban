
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext"; 
import { Toaster } from "@/components/ui/toaster";
import { NewChatPanel } from "@/components/chat/NewChatPanel"; 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChatProvider } from "@/contexts/ChatContext"; 

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import AdminRegister from "@/pages/auth/AdminRegister";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { CitizenLayout } from "@/components/layout/CitizenLayout";

import AdminDashboard from "@/pages/admin/Dashboard";
import CitizenDashboard from "@/pages/admin/Dashboard";
import UserManagement from "@/pages/admin/users/UserManagement";

// Correio Interno (Internal Mail) Module
import MailDashboard from "@/pages/admin/correio/MailDashboard";
import OficioDigital from "@/pages/admin/correio/OficioDigital";
import TemplateCreator from "@/pages/admin/correio/TemplateCreator";

// Chat Module
import AdminChatPage from "@/pages/admin/chat/ChatPage";
import CitizenChatPage from "@/pages/citizen/chat/ChatPage";

// Gabinete do Prefeito Module
import MayorDashboard from "@/pages/admin/gabinete/Dashboard";
import AppointmentScheduler from "@/pages/admin/gabinete/AppointmentScheduler";
import DirectRequests from "@/pages/admin/gabinete/DirectRequests";
import PublicPolicies from "@/pages/admin/gabinete/PublicPolicies";
import StrategicPrograms from "@/pages/admin/gabinete/StrategicPrograms";

// Administration Module
import AdministracaoIndex from "@/pages/admin/administracao/index";
import RHPage from "@/pages/admin/administracao/rh/index";
import ComprasPage from "@/pages/admin/administracao/compras/index";

// Health Module
import SaudeIndex from "@/pages/admin/saude/index";
import AtendimentosPage from "@/pages/admin/saude/atendimentos/index";
import MedicamentosPage from "@/pages/admin/saude/medicamentos/index";
import TFDPage from "@/pages/admin/saude/tfd/index";
import ProgramasPage from "@/pages/admin/saude/programas/index";
import CampanhasPage from "@/pages/admin/saude/campanhas/index";
import ACSPage from "@/pages/admin/saude/acs/index";

// Education Module
import EducacaoIndex from "@/pages/admin/educacao/index";
import EscolasPage from "@/pages/admin/educacao/escolas/index";
import MatriculaPage from "@/pages/admin/educacao/matricula/index";
import TransportePage from "@/pages/admin/educacao/transporte/index";
import PessoasPage from "@/pages/admin/educacao/pessoas/index";
// Novos imports para o módulo educacional
import AulasPage from "@/pages/admin/educacao/aulas/index";
import DesempenhoPage from "@/pages/admin/educacao/desempenho/index";
import CalendarioPage from "@/pages/admin/educacao/calendario/index";
import ComunicacaoPage from "@/pages/admin/educacao/comunicacao/index";
import MerendaPage from "@/pages/admin/educacao/merenda/index";
import OcorrenciasPage from "@/pages/admin/educacao/ocorrencias/index";

// Assistência Social Module
import BeneficiosPage from "@/pages/admin/assistencia/beneficios/index";
import ProgramasSociaisPage from "@/pages/admin/assistencia/programas/index";
import CRASCREASPage from "@/pages/admin/assistencia/cras/index";
import FamiliaVulneraveisPage from "@/pages/admin/assistencia/familias/index";

// Finanças Module
import FinancasIndex from "@/pages/admin/financas/index";
import FinancasDashboard from "@/pages/admin/financas/dashboard/index";
import SolicitacaoGuias from "@/pages/admin/financas/guias/index";
import ConsultarDebitos from "@/pages/admin/financas/debitos/index";
import Certidoes from "@/pages/admin/financas/certidoes/index";

// New Modules
import AgriculturaIndex from "@/pages/admin/agricultura/index";
import EsportesIndex from "@/pages/admin/esportes/index";
import CulturaIndex from "@/pages/admin/cultura/index";
import TurismoIndex from "@/pages/admin/turismo/index";
import HabitacaoIndex from "@/pages/admin/habitacao/index";
import SegurancaPublicaIndex from "@/pages/admin/seguranca/index";
import TransporteIndex from "@/pages/admin/transporte/index";
import OuvidoriaIndex from "@/pages/admin/ouvidoria/index";

// Create a new QueryClient instance
const queryClient = new QueryClient();

function App() {
  return (
    // Wrap the entire app with QueryClientProvider
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="light" storageKey="digiurban-theme">
          <AuthProvider>
            <ChatProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin-register" element={<AdminRegister />} />
                <Route path="/esqueci-senha" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="users" element={<UserManagement />} />
                  
                  {/* Correio Interno Routes */}
                  <Route path="correio/dashboard" element={<MailDashboard />} />
                  <Route path="correio/oficio-digital" element={<OficioDigital />} />
                  <Route path="correio/criador-oficios" element={<TemplateCreator />} />
                  
                  {/* Chat Route */}
                  <Route path="chat" element={<AdminChatPage />} />
                  
                  {/* Gabinete do Prefeito Routes */}
                  <Route path="gabinete/dashboard" element={<MayorDashboard />} />
                  <Route path="gabinete/agendamentos" element={<AppointmentScheduler />} />
                  <Route path="gabinete/solicitacoes" element={<DirectRequests />} />
                  <Route path="gabinete/politicas" element={<PublicPolicies />} />
                  <Route path="gabinete/programas" element={<StrategicPrograms />} />

                  {/* Administration Module Routes */}
                  <Route path="administracao" element={<AdministracaoIndex />} />
                  <Route path="administracao/rh" element={<RHPage />} />
                  <Route path="administracao/compras" element={<ComprasPage />} />
                  
                  {/* Health Module Routes */}
                  <Route path="saude" element={<SaudeIndex />} />
                  <Route path="saude/atendimentos" element={<AtendimentosPage />} />
                  <Route path="saude/medicamentos" element={<MedicamentosPage />} />
                  <Route path="saude/tfd" element={<TFDPage />} />
                  <Route path="saude/programas" element={<ProgramasPage />} />
                  <Route path="saude/campanhas" element={<CampanhasPage />} />
                  <Route path="saude/acs" element={<ACSPage />} />

                  {/* Education Module Routes */}
                  <Route path="educacao" element={<EducacaoIndex />} />
                  <Route path="educacao/escolas" element={<EscolasPage />} />
                  <Route path="educacao/matricula" element={<MatriculaPage />} />
                  <Route path="educacao/transporte" element={<TransportePage />} />
                  <Route path="educacao/pessoas" element={<PessoasPage />} />
                  <Route path="educacao/merenda" element={<MerendaPage />} />
                  <Route path="educacao/ocorrencias" element={<OcorrenciasPage />} />
                  
                  {/* Novas rotas para o módulo educacional */}
                  <Route path="educacao/aulas" element={<AulasPage />} />
                  <Route path="educacao/desempenho" element={<DesempenhoPage />} />
                  <Route path="educacao/calendario" element={<CalendarioPage />} />
                  <Route path="educacao/comunicacao" element={<ComunicacaoPage />} />

                  {/* Assistência Social Module Routes */}
                  <Route path="assistencia/beneficios" element={<BeneficiosPage />} />
                  <Route path="assistencia/programas" element={<ProgramasSociaisPage />} />
                  <Route path="assistencia/cras" element={<CRASCREASPage />} />
                  <Route path="assistencia/familias" element={<FamiliaVulneraveisPage />} />

                  {/* Finanças Module Routes */}
                  <Route path="financas" element={<FinancasIndex />} />
                  <Route path="financas/dashboard" element={<FinancasDashboard />} />
                  <Route path="financas/guias" element={<SolicitacaoGuias />} />
                  <Route path="financas/debitos" element={<ConsultarDebitos />} />
                  <Route path="financas/certidoes" element={<Certidoes />} />

                  {/* New Module Routes */}
                  {/* Agricultura */}
                  <Route path="agricultura" element={<AgriculturaIndex />} />
                  
                  {/* Esportes */}
                  <Route path="esportes" element={<EsportesIndex />} />
                  
                  {/* Cultura */}
                  <Route path="cultura" element={<CulturaIndex />} />
                  
                  {/* Turismo */}
                  <Route path="turismo" element={<TurismoIndex />} />
                  
                  {/* Habitação */}
                  <Route path="habitacao" element={<HabitacaoIndex />} />
                  
                  {/* Segurança Pública */}
                  <Route path="seguranca" element={<SegurancaPublicaIndex />} />
                  
                  {/* Transporte e Mobilidade */}
                  <Route path="transporte" element={<TransporteIndex />} />
                  
                  {/* Ouvidoria Municipal */}
                  <Route path="ouvidoria" element={<OuvidoriaIndex />} />
                </Route>

                {/* Citizen Routes */}
                <Route path="/citizen" element={<CitizenLayout />}>
                  <Route path="dashboard" element={<CitizenDashboard />} />
                  <Route path="chat" element={<CitizenChatPage />} />
                </Route>

                {/* Catch-all route for 404 */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              
              <Toaster />
              <NewChatPanel />
            </ChatProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
