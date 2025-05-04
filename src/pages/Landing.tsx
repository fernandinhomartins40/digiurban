
import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart,
  Building,
  CheckCircle,
  FileText,
  Heart,
  HelpCircle,
  Lock,
  MapPin,
  Phone,
  ShieldCheck,
  Users,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Heading } from "@/components/ui/heading";

// Module data
const modules = [
  {
    title: "Gabinete do Prefeito",
    description: "Gestão de políticas públicas, agendamentos e atendimento ao cidadão",
    icon: Building,
    color: "bg-blue-100 text-blue-700",
    features: ["Agendamentos", "Políticas Públicas", "Programas Estratégicos"],
  },
  {
    title: "Saúde",
    description: "Gestão completa do sistema de saúde municipal",
    icon: Heart,
    color: "bg-red-100 text-red-700",
    features: ["Campanhas", "Medicamentos", "Atendimentos", "TFD"],
  },
  {
    title: "Educação",
    description: "Administração escolar, transporte e merenda",
    icon: FileText,
    color: "bg-yellow-100 text-yellow-700",
    features: ["Matrículas", "Transporte", "Desempenho", "Merenda"],
  },
  {
    title: "Administração",
    description: "Gerenciamento de recursos humanos e compras",
    icon: Users,
    color: "bg-purple-100 text-purple-700",
    features: ["RH", "Compras", "Patrimônio"],
  },
  {
    title: "Finanças",
    description: "Controle financeiro e arrecadação",
    icon: BarChart,
    color: "bg-green-100 text-green-700",
    features: ["Guias", "Certidões", "Débitos"],
  },
  {
    title: "Assistência Social",
    description: "Gestão de programas sociais e benefícios",
    icon: CheckCircle,
    color: "bg-orange-100 text-orange-700",
    features: ["Benefícios", "Programas", "CRAS", "Famílias"],
  },
];

// Benefits data
const benefits = [
  {
    title: "Eficiência Operacional",
    description: "Reduza o tempo de processamento em até 70%",
    icon: CheckCircle,
  },
  {
    title: "Economia de Custos",
    description: "Economize até 30% em custos administrativos",
    icon: BarChart,
  },
  {
    title: "Satisfação do Cidadão",
    description: "Aumente a satisfação em mais de 80%",
    icon: Users,
  },
  {
    title: "Tomada de Decisão",
    description: "Dashboards e relatórios para decisões estratégicas",
    icon: FileText,
  },
];

// Features for carousel
const features = [
  {
    title: "Agendamento Inteligente",
    description: "Sistema de agendamentos com priorização automática e notificações",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Gestão de Políticas Públicas",
    description: "Acompanhe o ciclo completo de criação e execução de políticas municipais",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Atendimento ao Cidadão",
    description: "Portal integrado com todas as solicitações e serviços",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Painel Administrativo",
    description: "Dashboards analíticos para todos os setores da prefeitura",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
  },
];

// Use cases
const useCases = [
  {
    title: "Modernização da Gestão",
    before: "Processos manuais e desconectados",
    after: "Sistema integrado com visão completa da operação",
    improvement: "Redução de 65% no tempo de processamento",
  },
  {
    title: "Atendimento ao Cidadão",
    before: "Atendimento presencial com longas filas",
    after: "Múltiplos canais digitais de atendimento",
    improvement: "Satisfação do cidadão aumentou 75%",
  },
  {
    title: "Transparência",
    before: "Dados espalhados e de difícil acesso",
    after: "Portal de transparência integrado e automatizado",
    improvement: "100% de conformidade com legislação",
  },
];

const LandingPage: React.FC = () => {
  return (
    <div className="bg-background min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">DigiUrban</div>
          <div className="hidden md:flex space-x-6 text-sm font-medium">
            <a href="#modules" className="hover:text-primary transition-colors">Módulos</a>
            <a href="#benefits" className="hover:text-primary transition-colors">Benefícios</a>
            <a href="#features" className="hover:text-primary transition-colors">Funcionalidades</a>
            <a href="#usecases" className="hover:text-primary transition-colors">Casos de Uso</a>
            <a href="#security" className="hover:text-primary transition-colors">Segurança</a>
          </div>
          <div className="flex gap-3">
            <Button asChild size="sm" className="hidden md:inline-flex" variant="default">
              <Link to="/auth/login" state={{ userType: "admin" }}>
                <Building className="w-4 h-4 mr-2" />
                Área Administrativa
              </Link>
            </Button>
            <Button asChild size="sm" className="hidden md:inline-flex" variant="outline">
              <Link to="/auth/login" state={{ userType: "citizen" }}>
                <UserRound className="w-4 h-4 mr-2" />
                Portal do Cidadão
              </Link>
            </Button>
            <Button size="sm" variant="outline" className="md:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-background pt-16 md:pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 max-w-lg">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                Transformação Digital para sua Prefeitura
              </h1>
              <p className="text-lg text-muted-foreground">
                O DigiUrban é um sistema integrado que moderniza todos os setores da administração municipal, melhorando a eficiência e a experiência do cidadão.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="gap-2">
                  Agendar Demonstração <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Conhecer Módulos
                </Button>
              </div>
              
              <div className="flex flex-col gap-4 pt-6 pb-2 border-t border-border/30">
                <p className="text-base font-medium">Acesse o Sistema:</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                    <Link to="/auth/login" state={{ userType: "admin" }}>
                      <Building className="h-5 w-5" />
                      Área Administrativa
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2 border-green-600 text-green-700 hover:bg-green-50">
                    <Link to="/auth/login" state={{ userType: "citizen" }}>
                      <UserRound className="h-5 w-5" />
                      Portal do Cidadão
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-background"></div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Mais de <span className="font-medium">50 prefeituras</span> já utilizam nosso sistema
                </p>
              </div>
            </div>
            <div className="relative h-[300px] md:h-[400px] lg:h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-r from-[#D6BCFA] to-[#D3E4FD] rounded-lg shadow-xl overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-grid-white-300/20"></div>
                <img 
                  src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=800&q=80"
                  alt="Sistema de gestão municipal"
                  className="absolute inset-0 object-cover w-full h-full opacity-60 mix-blend-overlay"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent text-white">
                  <p className="font-medium">Sistema Integrado de Gestão Municipal</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-[#F97316]/10 rounded-full blur-3xl"></div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <Heading 
            title="Principais Benefícios"
            description="Veja como o DigiUrban pode transformar a gestão da sua cidade"
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border border-border/50 hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="py-20">
        <div className="container mx-auto px-4">
          <Heading 
            title="Módulos do Sistema"
            description="Conheça as áreas do DigiUrban que vão revolucionar sua gestão municipal"
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {modules.map((module, index) => (
              <Card key={index} className="border border-border/50 hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-2">
                  <div className={`w-12 h-12 rounded-full ${module.color} flex items-center justify-center mb-4`}>
                    <module.icon className="h-6 w-6" />
                  </div>
                  <CardTitle>{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {module.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Carousel */}
      <section id="features" className="py-20 bg-gradient-to-br from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <Heading 
            title="Funcionalidades Principais"
            description="Descubra ferramentas poderosas que facilitam a gestão municipal"
          />
          
          <div className="mt-12">
            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {features.map((feature, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                    <div className="p-1">
                      <Card>
                        <CardContent className="p-0">
                          <div className="relative h-48 overflow-hidden">
                            <img 
                              src={feature.image} 
                              alt={feature.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-6">
                            <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-6 gap-2">
                <CarouselPrevious />
                <CarouselNext />
              </div>
            </Carousel>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="usecases" className="py-20">
        <div className="container mx-auto px-4">
          <Heading 
            title="Casos de Uso"
            description="Exemplos reais de como o DigiUrban resolve problemas da gestão municipal"
          />
          
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {useCases.map((useCase, index) => (
              <Card key={index} className="border border-border/50">
                <CardHeader>
                  <CardTitle>{useCase.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Antes:</h4>
                    <p className="text-sm bg-destructive/10 text-destructive rounded-md px-3 py-2">{useCase.before}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Depois:</h4>
                    <p className="text-sm bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-md px-3 py-2">{useCase.after}</p>
                  </div>
                  <div className="pt-2">
                    <div className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                      <BarChart className="h-4 w-4" />
                      {useCase.improvement}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integration & Security Section */}
      <section id="security" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <Heading 
            title="Integração & Segurança"
            description="Infraestrutura robusta e segura para dados municipais"
          />
          
          <div className="grid md:grid-cols-2 gap-12 mt-12">
            <Card className="border border-border/50">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Segurança de Dados</CardTitle>
                <CardDescription>Proteção completa para informações sensíveis</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>Criptografia de dados em trânsito e em repouso</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>Controle granular de acesso baseado em papéis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>Autenticação em dois fatores</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>Conformidade com LGPD e outras regulamentações</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-border/50">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Integração & Infraestrutura</CardTitle>
                <CardDescription>Conexão com outros sistemas e robustez operacional</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>APIs para integração com sistemas legados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>Infraestrutura em nuvem com alta disponibilidade</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>Backups automáticos e plano de recuperação de desastres</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>Monitoramento contínuo de desempenho</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/20 to-[#F97316]/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Pronto para transformar a gestão da sua cidade?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Agende uma demonstração personalizada ou acesse o sistema para começar a usar agora.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Button size="lg" className="gap-2">
              Agendar Demonstração <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Falar com Especialista
            </Button>
          </div>
          
          <div className="flex flex-col items-center mt-8 pt-8 border-t border-primary/20">
            <p className="text-lg font-medium mb-4">Já possui acesso? Entre agora:</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                <Link to="/auth/login" state={{ userType: "admin" }}>
                  <Building className="h-5 w-5" />
                  Área Administrativa
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2 border-green-600 text-green-700 hover:bg-green-50">
                <Link to="/auth/login" state={{ userType: "citizen" }}>
                  <UserRound className="h-5 w-5" />
                  Portal do Cidadão
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold text-primary mb-4">DigiUrban</div>
              <p className="text-muted-foreground">
                Sistema integrado para modernizar a gestão municipal e melhorar a experiência do cidadão.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Módulos</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Gabinete do Prefeito</li>
                <li>Saúde</li>
                <li>Educação</li>
                <li>Administração</li>
                <li>Finanças</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Recursos</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Blog</li>
                <li>Documentação</li>
                <li>Suporte</li>
                <li>Materiais</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Contato</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>São Paulo, SP</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>(11) 1234-5678</span>
                </li>
                <li className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  <span>contato@digiurban.com.br</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/50 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2023 DigiUrban. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
