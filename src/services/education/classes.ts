
import { supabase } from "@/integrations/supabase/client";

export interface Class {
  id: string;
  name: string;
  subject: string;
  teacher: string;
  time: string;
  weekday: string;
  status: 'active' | 'inactive';
  school_id: string;
  class_id: string;
  room: string;
  max_students: number;
  current_students: number;
  created_at: string;
  updated_at: string;
}

export interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  teacher_id: string;
  teacher_name: string;
  class_id: string;
  objectives: string;
  content: string;
  resources: string;
  evaluation: string;
  date: string;
  duration: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

// Fetch all classes
export async function fetchClasses(): Promise<Class[]> {
  // This will be replaced with actual API calls once the backend is implemented
  // For now, returning mock data
  return [
    {
      id: "1",
      name: "5º Ano A",
      subject: "Matemática",
      teacher: "Maria Santos",
      time: "07:30 - 09:10",
      weekday: "Segunda-feira",
      status: 'active',
      school_id: "1",
      class_id: "5A",
      room: "201",
      max_students: 30,
      current_students: 28,
      created_at: "2023-01-15T10:00:00Z",
      updated_at: "2023-01-15T10:00:00Z"
    },
    {
      id: "2",
      name: "5º Ano A",
      subject: "Português",
      teacher: "João Silva",
      time: "09:10 - 10:00",
      weekday: "Segunda-feira",
      status: 'active',
      school_id: "1",
      class_id: "5A",
      room: "201",
      max_students: 30,
      current_students: 28,
      created_at: "2023-01-15T10:00:00Z",
      updated_at: "2023-01-15T10:00:00Z"
    },
    {
      id: "3",
      name: "5º Ano A",
      subject: "Ciências",
      teacher: "Ana Ferreira",
      time: "10:20 - 12:00",
      weekday: "Segunda-feira",
      status: 'active',
      school_id: "1",
      class_id: "5A",
      room: "203",
      max_students: 30,
      current_students: 28,
      created_at: "2023-01-15T10:00:00Z",
      updated_at: "2023-01-15T10:00:00Z"
    },
    {
      id: "4",
      name: "6º Ano B",
      subject: "Geografia",
      teacher: "Luisa Mendes",
      time: "07:30 - 09:10",
      weekday: "Segunda-feira",
      status: 'active',
      school_id: "1",
      class_id: "6B",
      room: "301",
      max_students: 32,
      current_students: 30,
      created_at: "2023-01-15T10:00:00Z",
      updated_at: "2023-01-15T10:00:00Z"
    },
    {
      id: "5",
      name: "6º Ano B",
      subject: "Matemática",
      teacher: "Rodrigo Pereira",
      time: "09:10 - 10:00",
      weekday: "Segunda-feira",
      status: 'active',
      school_id: "1",
      class_id: "6B",
      room: "301",
      max_students: 32,
      current_students: 30,
      created_at: "2023-01-15T10:00:00Z",
      updated_at: "2023-01-15T10:00:00Z"
    },
    {
      id: "6",
      name: "7º Ano C",
      subject: "História",
      teacher: "Carlos Oliveira",
      time: "07:30 - 09:10",
      weekday: "Terça-feira",
      status: 'inactive',
      school_id: "1",
      class_id: "7C",
      room: "302",
      max_students: 30,
      current_students: 25,
      created_at: "2023-01-15T10:00:00Z",
      updated_at: "2023-01-15T10:00:00Z"
    }
  ];
}

// Fetch specific class by ID
export async function fetchClassById(id: string): Promise<Class | null> {
  const classes = await fetchClasses();
  return classes.find(cls => cls.id === id) || null;
}

// Fetch all lesson plans
export async function fetchLessonPlans(): Promise<LessonPlan[]> {
  // This will be replaced with actual API calls once the backend is implemented
  // For now, returning mock data
  return [
    {
      id: "1",
      title: "Frações e Números Decimais",
      subject: "Matemática",
      teacher_id: "1",
      teacher_name: "Maria Santos",
      class_id: "5A",
      objectives: "Compreender o conceito de frações e sua relação com números decimais. Resolver problemas envolvendo frações e decimais.",
      content: "Conceito de frações, tipos de frações, operações com frações, conversão para números decimais.",
      resources: "Livro didático, material manipulativo, exercícios impressos.",
      evaluation: "Participação em sala, exercícios e avaliação formativa.",
      date: "12/05/2023",
      duration: "2 aulas (1h40min)",
      status: "approved",
      created_at: "2023-05-01T10:00:00Z",
      updated_at: "2023-05-01T10:00:00Z"
    },
    {
      id: "2",
      title: "Verbo e Tempos Verbais",
      subject: "Português",
      teacher_id: "2",
      teacher_name: "João Silva",
      class_id: "5A",
      objectives: "Identificar verbos em textos diversos. Compreender e utilizar corretamente os tempos verbais.",
      content: "Conceito de verbo, tempos verbais (presente, pretérito e futuro), modos verbais.",
      resources: "Livro didático, textos literários, exercícios impressos.",
      evaluation: "Análise de textos, produção textual e exercícios específicos.",
      date: "15/05/2023",
      duration: "2 aulas (1h40min)",
      status: "pending",
      created_at: "2023-05-05T14:30:00Z",
      updated_at: "2023-05-05T14:30:00Z"
    },
    {
      id: "3",
      title: "Sistema Solar",
      subject: "Ciências",
      teacher_id: "3",
      teacher_name: "Ana Ferreira",
      class_id: "5A",
      objectives: "Conhecer os planetas do sistema solar e suas características. Compreender o movimento dos astros.",
      content: "Composição do sistema solar, características dos planetas, movimento de rotação e translação.",
      resources: "Modelo do sistema solar, vídeos, apresentação de slides.",
      evaluation: "Atividade em grupo, criação de maquete, apresentação oral.",
      date: "18/05/2023",
      duration: "2 aulas (1h40min)",
      status: "approved",
      created_at: "2023-05-10T09:15:00Z",
      updated_at: "2023-05-10T09:15:00Z"
    },
    {
      id: "4",
      title: "Cartografia e Mapas",
      subject: "Geografia",
      teacher_id: "4",
      teacher_name: "Luisa Mendes",
      class_id: "6B",
      objectives: "Compreender conceitos básicos de cartografia. Interpretar diferentes tipos de mapas.",
      content: "Elementos de um mapa, escala, legenda, coordenadas geográficas, tipos de projeções.",
      resources: "Atlas, mapas impressos, globo terrestre.",
      evaluation: "Interpretação de mapas, criação de mapas temáticos.",
      date: "14/05/2023",
      duration: "2 aulas (1h40min)",
      status: "draft",
      created_at: "2023-05-07T11:20:00Z",
      updated_at: "2023-05-07T11:20:00Z"
    },
    {
      id: "5",
      title: "Civilizações Antigas: Egito",
      subject: "História",
      teacher_id: "5",
      teacher_name: "Carlos Oliveira",
      class_id: "7C",
      objectives: "Conhecer a civilização egípcia antiga, sua organização social, política e cultural.",
      content: "Localização geográfica, períodos históricos, faraós, escrita hieroglífica, religião, arte e arquitetura.",
      resources: "Livro didático, documentários, imagens de artefatos.",
      evaluation: "Seminário em grupo, produção de texto, quiz.",
      date: "16/05/2023",
      duration: "3 aulas (2h30min)",
      status: "pending",
      created_at: "2023-05-09T13:45:00Z",
      updated_at: "2023-05-09T13:45:00Z"
    }
  ];
}

// Fetch specific lesson plan by ID
export async function fetchLessonPlanById(id: string): Promise<LessonPlan | null> {
  const plans = await fetchLessonPlans();
  return plans.find(plan => plan.id === id) || null;
}
