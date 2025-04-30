
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await resetPassword(email);
      setEmailSent(true);
    } catch (error: any) {
      setError(error.message || "Falha ao enviar email de recuperação de senha.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">digiUrbis</h1>
          <p className="text-gray-600">Recuperação de Senha</p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate("/login")} 
                className="mr-2"
              >
                <ArrowLeft size={18} />
              </Button>
              <div>
                <CardTitle className="text-2xl">Recuperar Senha</CardTitle>
                <CardDescription>
                  Digite seu email para receber um link de recuperação de senha
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          {emailSent ? (
            <CardContent className="space-y-4 pt-4">
              <Alert>
                <AlertDescription>
                  Email enviado com sucesso. Por favor, verifique sua caixa de entrada
                  e siga as instruções para redefinir sua senha.
                </AlertDescription>
              </Alert>
              <div className="text-center mt-4">
                <Button onClick={() => navigate("/login")} variant="outline" className="w-full">
                  Voltar para o Login
                </Button>
              </div>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Enviar Email de Recuperação
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
