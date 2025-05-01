
import React from "react";
import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="grid lg:grid-cols-2 h-screen">
      <div className="hidden lg:block bg-gradient-to-r from-primary to-primary-foreground">
        <div className="flex items-center justify-center h-full">
          <div className="px-8">
            <h1 className="text-4xl font-bold text-white">digiurban</h1>
            <p className="mt-4 text-lg text-white/90">
              Sistema de Gestão Municipal Integrado
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:hidden">
            <h1 className="text-2xl font-bold">digiurban</h1>
            <p className="mt-2 text-gray-600">
              Sistema de Gestão Municipal Integrado
            </p>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
