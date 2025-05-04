
import React, { useEffect, useRef, useState } from "react";
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
  ChevronDown,
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
    gradient: "from-blue-200 to-blue-50",
    features: ["Agendamentos", "Políticas Públicas", "Programas Estratégicos"],
  },
  {
    title: "Saúde",
    description: "Gestão completa do sistema de saúde municipal",
    icon: Heart,
    color: "bg-red-100 text-red-700",
    gradient: "from-red-200 to-red-50",
    features: ["Campanhas", "Medicamentos", "Atendimentos", "TFD"],
  },
  {
    title: "Educação",
    description: "Administração escolar, transporte e merenda",
    icon: FileText,
    color: "bg-yellow-100 text-yellow-700",
    gradient: "from-yellow-200 to-yellow-50",
    features: ["Matrículas", "Transporte", "Desempenho", "Merenda"],
  },
  {
    title: "Administração",
    description: "Gerenciamento de recursos humanos e compras",
    icon: Users,
    color: "bg-purple-100 text-purple-700",
    gradient: "from-purple-200 to-purple-50",
    features: ["RH", "Compras", "Patrimônio"],
  },
  {
    title: "Finanças",
    description: "Controle financeiro e arrecadação",
    icon: BarChart,
    color: "bg-green-100 text-green-700",
    gradient: "from-green-200 to-green-50",
    features: ["Guias", "Certidões", "Débitos"],
  },
  {
    title: "Assistência Social",
    description: "Gestão de programas sociais e benefícios",
    icon: CheckCircle,
    color: "bg-orange-100 text-orange-700",
    gradient: "from-orange-200 to-orange-50",
    features: ["Benefícios", "Programas", "CRAS", "Famílias"],
  },
];

// Benefits data
const benefits = [
  {
    title: "Eficiência Operacional",
    description: "Reduza o tempo de processamento em até 70%",
    icon: CheckCircle,
    gradient: "from-emerald-200 to-emerald-50",
  },
  {
    title: "Economia de Custos",
    description: "Economize até 30% em custos administrativos",
    icon: BarChart,
    gradient: "from-sky-200 to-sky-50",
  },
  {
    title: "Satisfação do Cidadão",
    description: "Aumente a satisfação em mais de 80%",
    icon: Users,
    gradient: "from-violet-200 to-violet-50",
  },
  {
    title: "Tomada de Decisão",
    description: "Dashboards e relatórios para decisões estratégicas",
    icon: FileText,
    gradient: "from-amber-200 to-amber-50",
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
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Atendimento ao Cidadão",
    before: "Atendimento presencial com longas filas",
    after: "Múltiplos canais digitais de atendimento",
    improvement: "Satisfação do cidadão aumentou 75%",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Transparência",
    before: "Dados espalhados e de difícil acesso",
    after: "Portal de transparência integrado e automatizado",
    improvement: "100% de conformidade com legislação",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
  },
];

const LandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  
  // Initialize refs for each section
  useEffect(() => {
    const sections = ["modules", "benefits", "features", "usecases", "security"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) {
        sectionRefs.current[section] = element;
        observer.observe(element);
      }
    });

    return () => {
      sections.forEach((section) => {
        const element = sectionRefs.current[section];
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-background min-h-screen overflow-x-hidden">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">D</div>
            <div className="text-2xl font-bold text-primary">DigiUrban</div>
          </div>
          <div className="hidden md:flex space-x-6 text-sm font-medium">
            <a 
              href="#modules" 
              className={`hover:text-primary transition-colors ${activeSection === "modules" ? "text-primary font-medium" : ""}`}
            >
              Módulos
            </a>
            <a 
              href="#benefits" 
              className={`hover:text-primary transition-colors ${activeSection === "benefits" ? "text-primary font-medium" : ""}`}
            >
              Benefícios
            </a>
            <a 
              href="#features" 
              className={`hover:text-primary transition-colors ${activeSection === "features" ? "text-primary font-medium" : ""}`}
            >
              Funcionalidades
            </a>
            <a 
              href="#usecases" 
              className={`hover:text-primary transition-colors ${activeSection === "usecases" ? "text-primary font-medium" : ""}`}
            >
              Casos de Uso
            </a>
            <a 
              href="#security" 
              className={`hover:text-primary transition-colors ${activeSection === "security" ? "text-primary font-medium" : ""}`}
            >
              Segurança
            </a>
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
            <Button size="sm" variant="outline" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
              )}
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4 px-4 shadow-lg animate-fade-in">
            <div className="flex flex-col space-y-4">
              <a href="#modules" className="hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Módulos</a>
              <a href="#benefits" className="hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Benefícios</a>
              <a href="#features" className="hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Funcionalidades</a>
              <a href="#usecases" className="hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Casos de Uso</a>
              <a href="#security" className="hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>Segurança</a>
              <div className="pt-4 flex flex-col gap-3 border-t border-gray-100">
                <Button asChild size="sm" variant="default">
                  <Link to="/auth/login" state={{ userType: "admin" }}>
                    <Building className="w-4 h-4 mr-2" />
                    Área Administrativa
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link to="/auth/login" state={{ userType: "citizen" }}>
                    <UserRound className="w-4 h-4 mr-2" />
                    Portal do Cidadão
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-blue-50 to-background pt-16 md:pt-24 pb-20">
        {/* Animated background elements */}
        <div className="absolute top-10 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-blue-200 to-purple-200 mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-orange-200 to-pink-200 mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
        
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 max-w-lg animate-fade-in">
              <div className="inline-block">
                <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  Plataforma Municipal Inteligente
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Transformação Digital
                </span>{" "}
                para sua Prefeitura
              </h1>
              <p className="text-lg text-muted-foreground">
                O DigiUrban é um sistema integrado que moderniza todos os setores da administração municipal, melhorando a eficiência e a experiência do cidadão.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="gap-2 group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200">
                  Agendar Demonstração 
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button size="lg" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors">
                  Conhecer Módulos
                </Button>
              </div>
              
              <div className="flex flex-col gap-4 pt-6 pb-2 border-t border-border/30 animate-fade-in delay-200">
                <p className="text-base font-medium">Acesse o Sistema:</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 transition-transform">
                    <Link to="/auth/login" state={{ userType: "admin" }}>
                      <Building className="h-5 w-5" />
                      Área Administrativa
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2 border-green-600 text-green-700 hover:bg-green-50 hover:scale-105 transition-transform">
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
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-white"></div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Mais de <span className="font-medium">50 prefeituras</span> já utilizam nosso sistema
                </p>
              </div>
            </div>
            <div className="relative h-[300px] md:h-[400px] lg:h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-r from-[#D6BCFA] to-[#D3E4FD] rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
                <div className="absolute inset-0 opacity-20 bg-grid-white-300/20 group-hover:opacity-30 transition-opacity"></div>
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full blur-2xl transform -translate-x-10 translate-y-10 group-hover:scale-110 transition-transform duration-500"></div>
                <img 
                  src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=800&q=80"
                  alt="Sistema de gestão municipal"
                  className="absolute inset-0 object-cover w-full h-full opacity-70 mix-blend-overlay"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent text-white">
                  <p className="font-medium">Sistema Integrado de Gestão Municipal</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 w-40 h-40 bg-gradient-to-r from-blue-300/20 to-indigo-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-gradient-to-r from-orange-300/20 to-red-300/20 rounded-full blur-3xl"></div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <Heading 
            title={
              <span className="text-3xl font-bold relative">
                Principais Benefícios
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-400"></span>
              </span>
            }
            description="Veja como o DigiUrban pode transformar a gestão da sua cidade"
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border border-border/50 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group overflow-hidden bg-white">
                <CardHeader className="pb-2 relative">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="group-hover:text-blue-700 transition-colors">{benefit.title}</CardTitle>
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
      <section id="modules" className="py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-blue-50 transform -skew-y-2"></div>
        <div className="absolute bottom-0 right-0 w-full h-24 bg-blue-50 transform skew-y-2"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <Heading 
            title={
              <span className="text-3xl font-bold relative">
                Módulos do Sistema
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-400"></span>
              </span>
            }
            description="Conheça as áreas do DigiUrban que vão revolucionar sua gestão municipal"
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {modules.map((module, index) => (
              <Card 
                key={index} 
                className="border border-border/50 hover:border-blue-200 hover:shadow-xl transition-all duration-300 group overflow-hidden bg-white"
              >
                <CardHeader className="pb-2 relative">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${module.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <module.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="group-hover:text-blue-700 transition-colors">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {module.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
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
            title={
              <span className="text-3xl font-bold relative">
                Funcionalidades Principais
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-400"></span>
              </span>
            }
            description="Descubra ferramentas poderosas que facilitam a gestão municipal"
          />
          
          <div className="mt-12">
            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {features.map((feature, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                    <div className="p-1">
                      <Card className="overflow-hidden border-0 shadow-lg group hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-0">
                          <div className="relative h-52 overflow-hidden">
                            <img 
                              src={feature.image} 
                              alt={feature.title} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-60"></div>
                          </div>
                          <div className="p-6 bg-white">
                            <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-700 transition-colors">{feature.title}</h3>
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
      <section id="usecases" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <Heading 
            title={
              <span className="text-3xl font-bold relative">
                Casos de Uso
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-400"></span>
              </span>
            }
            description="Exemplos reais de como o DigiUrban resolve problemas da gestão municipal"
          />
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {useCases.map((useCase, index) => (
              <Card key={index} className="border border-border/50 hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={useCase.image} 
                    alt={useCase.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/20"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-xl">{useCase.title}</h3>
                  </div>
                </div>
                <CardContent className="space-y-4 pt-5">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Antes:</h4>
                    <p className="text-sm bg-destructive/10 text-destructive rounded-md px-3 py-2">{useCase.before}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Depois:</h4>
                    <p className="text-sm bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-md px-3 py-2">{useCase.after}</p>
                  </div>
                  <div className="pt-2">
                    <div className="inline-flex items-center gap-1 text-sm font-medium text-blue-600">
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
      <section id="security" className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <Heading 
            title={
              <span className="text-3xl font-bold relative">
                Integração & Segurança
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-400"></span>
              </span>
            }
            description="Infraestrutura robusta e segura para dados municipais"
          />
          
          <div className="grid md:grid-cols-2 gap-12 mt-12">
            <Card className="border border-border/50 hover:border-blue-200 hover:shadow-xl transition-all duration-300 group overflow-hidden bg-white">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-200 to-indigo-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-6 w-6 text-indigo-700" />
                </div>
                <CardTitle className="group-hover:text-blue-700 transition-colors">Segurança de Dados</CardTitle>
                <CardDescription>Proteção completa para informações sensíveis</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                    <span>Criptografia de dados em trânsito e em repouso</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                    <span>Controle granular de acesso baseado em papéis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                    <span>Autenticação em dois fatores</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                    <span>Conformidade com LGPD e outras regulamentações</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-border/50 hover:border-blue-200 hover:shadow-xl transition-all duration-300 group overflow-hidden bg-white">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-200 to-blue-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Lock className="h-6 w-6 text-blue-700" />
                </div>
                <CardTitle className="group-hover:text-blue-700 transition-colors">Integração & Infraestrutura</CardTitle>
                <CardDescription>Conexão com outros sistemas e robustez operacional</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                    <span>APIs para integração com sistemas legados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                    <span>Infraestrutura em nuvem com alta disponibilidade</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                    <span>Backups automáticos e plano de recuperação de desastres</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                    <span>Monitoramento contínuo de desempenho</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Pronto para transformar a gestão da sua cidade?
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
              Agende uma demonstração personalizada ou acesse o sistema para começar a usar agora.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <Button size="lg" className="gap-2 group bg-white text-blue-700 hover:bg-blue-50">
                Agendar Demonstração <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 hover:bg-white/10 transition-colors">
                Falar com Especialista
              </Button>
            </div>
            
            <div className="flex flex-col items-center mt-8 pt-8 border-t border-white/20">
              <p className="text-lg font-medium mb-4">Já possui acesso? Entre agora:</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild size="lg" className="gap-2 bg-white text-blue-700 hover:bg-blue-50 hover:scale-105 transition-all">
                  <Link to="/auth/login" state={{ userType: "admin" }}>
                    <Building className="h-5 w-5" />
                    Área Administrativa
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="gap-2 border-white/30 hover:bg-white/10 hover:scale-105 transition-all">
                  <Link to="/auth/login" state={{ userType: "citizen" }}>
                    <UserRound className="h-5 w-5" />
                    Portal do Cidadão
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xl">D</div>
                <div className="text-2xl font-bold text-white">DigiUrban</div>
              </div>
              <p className="text-gray-400">
                Sistema integrado para modernizar a gestão municipal e melhorar a experiência do cidadão.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg text-white mb-4">Módulos</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-white transition-colors"><a href="#modules">Gabinete do Prefeito</a></li>
                <li className="hover:text-white transition-colors"><a href="#modules">Saúde</a></li>
                <li className="hover:text-white transition-colors"><a href="#modules">Educação</a></li>
                <li className="hover:text-white transition-colors"><a href="#modules">Administração</a></li>
                <li className="hover:text-white transition-colors"><a href="#modules">Finanças</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-lg text-white mb-4">Recursos</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-white transition-colors"><a href="#">Blog</a></li>
                <li className="hover:text-white transition-colors"><a href="#">Documentação</a></li>
                <li className="hover:text-white transition-colors"><a href="#">Suporte</a></li>
                <li className="hover:text-white transition-colors"><a href="#">Materiais</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-lg text-white mb-4">Contato</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-3 hover:text-white transition-colors">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  <span>São Paulo, SP</span>
                </li>
                <li className="flex items-center gap-3 hover:text-white transition-colors">
                  <Phone className="h-5 w-5 text-blue-400" />
                  <span>(11) 1234-5678</span>
                </li>
                <li className="flex items-center gap-3 hover:text-white transition-colors">
                  <HelpCircle className="h-5 w-5 text-blue-400" />
                  <span>contato@digiurban.com.br</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2023 DigiUrban. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Back to top button */}
      <button 
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50 group"
        aria-label="Voltar ao topo"
      >
        <ChevronDown className="h-5 w-5 transform rotate-180 group-hover:-translate-y-1 transition-transform" />
      </button>
    </div>
  );
};

export default LandingPage;
