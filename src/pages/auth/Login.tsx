
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, userType, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeUserType, setActiveUserType] = useState<"admin" | "citizen">("admin");
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    console.log("Login - Auth state:", { isLoading, isAuthenticated, userType });
    
    if (isAuthenticated && userType) {
      console.log("Login: Already authenticated, redirecting to dashboard:", userType);
      const redirectPath = userType === "admin" ? "/admin/dashboard" : "/citizen/dashboard";
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, userType, navigate, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLocalLoading(true);

    try {
      console.log("Login: Attempting login with:", { email, activeUserType });
      await login(email, password, activeUserType);
      console.log("Login: Login function completed");
      
      // Force redirecionamento após sucesso no login após um pequeno delay
      // Este é um fallback caso o listener de estado não funcione
      setTimeout(() => {
        const redirectPath = activeUserType === "admin" ? "/admin/dashboard" : "/citizen/dashboard";
        console.log(`Login: Forced redirect to ${redirectPath} after successful login`);
        navigate(redirectPath, { replace: true });
      }, 500);
    } catch (error: any) {
      console.error("Login: Error during login:", error);
      setError(error.message || "Falha no login. Verifique suas credenciais e tente novamente.");
    } finally {
      // Always ensure local loading state is reset
      setTimeout(() => {
        setLocalLoading(false);
      }, 500);
    }
  };

  // Show local loading OR global loading, but prevent showing both
  const showLoading = localLoading || (isLoading && !localLoading);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">digiurban</h1>
          <p className="text-gray-600">Sistema Integrado de Gestão Municipal</p>
        </div>

        <Tabs defaultValue="admin" onValueChange={(value) => setActiveUserType(value as "admin" | "citizen")}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="admin">Administração</TabsTrigger>
            <TabsTrigger value="citizen">Cidadão</TabsTrigger>
          </TabsList>

          <TabsContent value="admin">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Login Administração</CardTitle>
                <CardDescription>
                  Entre com suas credenciais administrativas para acessar o sistema.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="nome@prefeitura.gov.br"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={showLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Senha</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={showLoading}
                    />
                  </div>
                  <div className="text-right">
                    <Link to="/esqueci-senha" className="text-sm text-primary hover:underline">
                      Esqueci minha senha
                    </Link>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button className="w-full" type="submit" disabled={showLoading}>
                    {showLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {showLoading ? "Processando..." : "Entrar"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    onClick={() => navigate("/admin-register")}
                    disabled={showLoading}
                  >
                    Criar conta de administrador
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="citizen">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Login Cidadão</CardTitle>
                <CardDescription>
                  Entre com suas credenciais para acessar os serviços municipais.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="citizen-email">Email</Label>
                    <Input
                      id="citizen-email"
                      type="email"
                      placeholder="nome@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={showLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="citizen-password">Senha</Label>
                    <Input
                      id="citizen-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={showLoading}
                    />
                  </div>
                  <div className="text-right">
                    <Link to="/esqueci-senha" className="text-sm text-primary hover:underline">
                      Esqueci minha senha
                    </Link>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button className="w-full" type="submit" disabled={showLoading}>
                    {showLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {showLoading ? "Processando..." : "Entrar"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    onClick={() => navigate("/register")}
                    disabled={showLoading}
                  >
                    Criar conta
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
