
import { SidebarItemProps } from "@/types/sidebar";
import {
  getDashboardItem,
  getCorreioItem,
  getChatItem,
  getGabineteItem,
  getAdministracaoItem,
  getSaudeItem,
  getEducacaoItem,
  getAssistenciaItem,
  getMeioAmbienteItem,
  getObrasItem,
  getServicosItem,
  getFinancasItem
} from "./items";

export function getSidebarItems(unreadMailCount?: number): SidebarItemProps[] {
  return [
    getDashboardItem(),
    getCorreioItem(unreadMailCount),
    getChatItem(),
    getGabineteItem(),
    getAdministracaoItem(),
    getSaudeItem(),
    getEducacaoItem(),
    getAssistenciaItem(),
    getMeioAmbienteItem(),
    getObrasItem(),
    getServicosItem(),
    getFinancasItem(),
  ];
}
