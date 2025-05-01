
import React from "react";
import {
  getAdministracaoItem,
  getAssistenciaItem,
  getChatItem,
  getCorreioItem,
  getDashboardItem,
  getEducacaoItem,
  getFinancasItem,
  getGabineteItem,
  getMeioAmbienteItem,
  getObrasItem,
  getSaudeItem,
  getServicosItem,
} from "./items";

const sidebarItems = [
  getDashboardItem(),
  getGabineteItem(),
  getEducacaoItem(),
  getSaudeItem(),
  getAssistenciaItem(),
  getAdministracaoItem(),
  getServicosItem(),
  getFinancasItem(),
  getObrasItem(),
  getMeioAmbienteItem(),
  getCorreioItem(),
  getChatItem(),
];

export default sidebarItems;
