
import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { SuspenseWrapper } from "@/components/common/SuspenseWrapper";

// Lazy load pages
const ComprasIndex = lazy(() => import("@/pages/admin/compras/index"));
const Fornecedores = lazy(() => import("@/pages/admin/compras/fornecedores/FornecedoresPage"));
const Contratos = lazy(() => import("@/pages/admin/compras/contratos/ContratosPage"));

export const comprasRoutes: RouteObject[] = [
  {
    path: "compras",
    element: <ComprasIndex />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <div className="container mx-auto py-6">
              <h1 className="text-2xl font-bold">Módulo de Compras</h1>
            </div>
          </SuspenseWrapper>
        ),
      },
      {
        path: "fornecedores",
        element: (
          <SuspenseWrapper>
            <Fornecedores />
          </SuspenseWrapper>
        ),
      },
      {
        path: "contratos",
        element: (
          <SuspenseWrapper>
            <Contratos />
          </SuspenseWrapper>
        ),
      },
    ],
  },
];
