
import { SidebarItemProps } from "@/types/sidebar";
import { getChatItem } from "./ChatItem";
import { getUserRolesItem } from "./UserRolesItem";
import { getGabineteItem } from "./GabineteItem";
import { getCorreioItem } from "./CorreioItem";
import { getFinancasItem } from "./FinancasItem";
import { getEducacaoItem } from "./EducacaoItem";
import { getSaudeItem } from "./SaudeItem";
import { getAssistenciaItem } from "./AssistenciaItem";
import { getObrasItem } from "./ObrasItem";
import { getServicosItem } from "./ServicosItem";
import { getMeioAmbienteItem } from "./MeioAmbienteItem";
import { getAgriculturaItem } from "./AgriculturaItem";
import { getEsportesItem } from "./EsportesItem";
import { getCulturaItem } from "./CulturaItem";
import { getTurismoItem } from "./TurismoItem";
import { getHabitacaoItem } from "./HabitacaoItem";
import { getSegurancaPublicaItem } from "./SegurancaPublicaItem";
import { getTransporteItem } from "./TransporteItem";
import { getOuvidoriaItem } from "./OuvidoriaItem";
import { getSolicitacoesItem } from "./SolicitacoesItem";
import { getRecursosHumanosItem } from "./RecursosHumanosItem";
import { getComprasItem } from "./ComprasItem";
import { getDashboardItem } from "./DashboardItem";

export const getSidebarItems = (unreadCount: number = 0): SidebarItemProps[] => {
  // Include the Dashboard item and organize other items
  const items: SidebarItemProps[] = [
    getDashboardItem(),            // Dashboard should be the first item
    getGabineteItem(),             // 2º Gabinete do Prefeito 
    getUserRolesItem(),            // 3º Gerenciamento de Usuários
    getCorreioItem(unreadCount),   // 4º Correio Interno
    getChatItem(unreadCount),      // 5º Chat
    getSolicitacoesItem(),         // 6º Solicitações
    
    // The remaining items kept in the same order they were before
    getRecursosHumanosItem(),
    getComprasItem(),
    getFinancasItem(),
    getEducacaoItem(),
    getSaudeItem(),
    getAssistenciaItem(),
    getAgriculturaItem(),
    getEsportesItem(),
    getCulturaItem(),
    getTurismoItem(),
    getHabitacaoItem(),
    getSegurancaPublicaItem(),
    getTransporteItem(),
    getObrasItem(),
    getServicosItem(),
    getMeioAmbienteItem(),
    getOuvidoriaItem(),
  ];
  
  return items;
};
