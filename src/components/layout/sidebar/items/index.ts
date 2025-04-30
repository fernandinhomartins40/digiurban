
import { SidebarItemProps } from "@/types/sidebar";
import { getDashboardItem } from "./DashboardItem";
import { getChatItem } from "./ChatItem";
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

export const getSidebarItems = (unreadCount: number = 0): SidebarItemProps[] => [
  getDashboardItem(),
  getChatItem(unreadCount),
  getGabineteItem(),
  getCorreioItem(unreadCount),
  getAdministracaoItem(),
  getFinancasItem(),
  getEducacaoItem(),
  getSaudeItem(),
  getAssistenciaItem(),
  getObrasItem(),
  getServicosItem(),
  getMeioAmbienteItem(),
];
