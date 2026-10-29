export type EventLanguage = 'es' | 'en';
export interface Evento {
  slug: string;
  title: string;
  type: 'Webinar' | 'Meetup' | 'Evento';
  date: string;
  image: string;
  time?: string;
  registrationUrl?: string;
  summary: Record<EventLanguage, string>;
  description: Record<EventLanguage, string[]>;
  topics: Record<EventLanguage, string[]>;
}

export const EVENTOS: Evento[] = [{
  slug: 'databricks-para-todos-2026-11-12',
  title: 'Databricks para todos',
  type: 'Webinar',
  date: '2026-11-12',
  time: '11:00 a. m.',
  registrationUrl: 'https://eventos.talentoparati.com/eventos/databricks-para-todos',
  image: '/images/events/databricks-para-todos-2026-11-12.webp',
  summary: {
    es: 'Descubre qué es Databricks, cómo funciona y qué valor puede aportar a tu empresa. Una charla introductoria, sin conocimientos técnicos previos.',
    en: 'Discover what Databricks is, how it works and the value it can bring to your company. An introductory talk with no technical background required.',
  },
  description: {
    es: [
      'Recorreremos cómo ha evolucionado el mundo de los datos y por qué hoy las empresas buscan integrar sus procesos de ingeniería de datos, analítica e inteligencia artificial en una misma plataforma.',
      'A través de ejemplos sencillos y casos de uso empresariales, conocerás las principales capacidades de Databricks y cómo distintos equipos pueden aprovecharlas para transformar datos en decisiones.',
      'También conversaremos sobre qué considerar antes de empezar y cómo dar los primeros pasos de adopción según las necesidades de tu organización. Al finalizar, tendremos un espacio de preguntas para resolver dudas y explorar oportunidades de aplicación en tu empresa.',
    ],
    en: [
      'We will explore how the world of data has evolved and why companies are bringing data engineering, analytics and artificial intelligence together on one platform.',
      'Through simple examples and business use cases, you will discover the main capabilities of Databricks and how different teams can turn data into decisions.',
      'We will also discuss what to consider before getting started and how to plan adoption around your organization’s needs. We will finish with a Q&A to address questions and explore opportunities for your company.',
    ],
  },
  topics: {
    es: ['La evolución de los datos', 'Ingeniería, analítica e IA en Databricks', 'Casos de uso empresariales', 'Primeros pasos de adopción', 'Preguntas y respuestas'],
    en: ['The evolution of data', 'Engineering, analytics and AI in Databricks', 'Business use cases', 'First steps toward adoption', 'Questions and answers'],
  },
}];

// Compare calendar dates in the event audience's timezone, including the event day.
export const proximosEventos = () => {
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date());
  return EVENTOS.filter(event => event.date >= today).sort((a, b) => a.date.localeCompare(b.date));
};
