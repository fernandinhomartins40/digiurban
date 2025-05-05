
import { SidebarItemProps } from "@/types/sidebar";
import { getDashboardItem } from "./DashboardItem";
import { getChatItem } from "./ChatItem";
import { getUserRolesItem } from "./UserRolesItem";
import { getGabineteItem } from "./GabineteItem";
import { getCorreioItem } from "./CorreioItem";
import { getAdministracaoItem } from "./AdministracaoItem";
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

export const getSidebarItems = (unreadCount: number = 0): SidebarItemProps[] => [
  getDashboardItem(),
  getChatItem(unreadCount),
  getUserRolesItem(), // Added user roles item after chat
  getGabineteItem(),
  getCorreioItem(unreadCount),
  getAdministracaoItem(),
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
