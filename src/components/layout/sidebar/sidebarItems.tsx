
import React from "react";
import { getSaudeItem } from "./items/SaudeItem";
import { getAssistenciaItem } from "./items/AssistenciaItem";
import { getObrasItem } from "./items/ObrasItem";
import { getCorreioItem } from "./items/CorreioItem";
import { getGabineteItem } from "./items/GabineteItem";
import { getChatItem } from "./items/ChatItem";
import { getFinancasItem } from "./items/FinancasItem";
import { getAdministracaoItem } from "./items/AdministracaoItem";
import { getEducacaoItem } from "./items/EducacaoItem";
import { getDashboardItem } from "./items/DashboardItem";
import { getExecutivoItem } from "./items/ExecutivoItem";
import { SidebarItemProps } from "@/types/sidebar";

export const getSidebarItems = (unreadMailCount = 0): SidebarItemProps[] => {
  return [
    getDashboardItem(),
    getExecutivoItem(),
    getSaudeItem(),
    getEducacaoItem(),
    getAssistenciaItem(),
    getObrasItem(),
    getCorreioItem(unreadMailCount),
    getGabineteItem(),
    getFinancasItem(),
    getAdministracaoItem(),
    getChatItem(),
  ];
};
