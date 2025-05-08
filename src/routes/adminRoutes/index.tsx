
import { RouteObject } from "react-router-dom";
import { adminDashboardRoutes } from "./adminDashboardRoutes";
import { educacaoRoutes } from "./educacaoRoutes";
import { saudeRoutes } from "./saudeRoutes";
import { assistenciaRoutes } from "./assistenciaRoutes";
import { gabineteRoutes } from "./gabineteRoutes";
import { correioRoutes } from "./correioRoutes";
import { financasRoutes } from "./financasRoutes";
import { administracaoRoutes } from "./administracaoRoutes";
import { obrasRoutes } from "./obrasRoutes";
import { executivoRoutes } from "./executivoRoutes";
import { chatGptRoutes } from "./chatGptRoutes";
import { requestsRoutes } from "./requestsRoutes";

// Admin routes
export const adminRoutes: RouteObject[] = [
  ...adminDashboardRoutes,
  ...executivoRoutes,
  ...saudeRoutes,
  ...educacaoRoutes,
  ...assistenciaRoutes,
  ...gabineteRoutes,
  ...obrasRoutes,
  ...correioRoutes,
  ...financasRoutes,
  ...administracaoRoutes,
  ...chatGptRoutes,
  ...requestsRoutes,
];
