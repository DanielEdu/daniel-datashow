// Catálogo de presentaciones interactivas.
// Cada deck vive como sitio estático en public/slides/<slug>/ (index.html + assets)
// y se sirve tal cual en /slides/<slug>/. Para agregar uno: copiar la carpeta y sumar una entrada aquí.

export type Categoria = 'databricks' | 'data-engineering' | 'ia' | 'comunidad';

export interface Presentacion {
	slug: string;
	titulo: string;
	descripcion: { es: string; en: string };
	categoria: Categoria;
	fecha: string; // ISO
	tags: string[];
	slides: number;
	destacada?: boolean;
}

export const CATEGORIAS: Record<Categoria, { es: string; en: string }> = {
	databricks: { es: 'Databricks', en: 'Databricks' },
	'data-engineering': { es: 'Data Engineering', en: 'Data Engineering' },
	ia: { es: 'IA y agentes', en: 'AI & agents' },
	comunidad: { es: 'Comunidad y carrera', en: 'Community & career' },
};

export const PRESENTACIONES: Presentacion[] = [
	{
		slug: 'del-papel-a-la-ia-iquitos',
		titulo: 'Del papel a la IA · Iquitos Data Fest',
		descripcion: {
			es: 'Edición Iquitos Data Fest 2026: la evolución de los datos navegando el Amazonas, de las tablillas a los agentes de IA.',
			en: 'Iquitos Data Fest 2026 edition: the evolution of data sailing the Amazon, from clay tablets to AI agents.',
		},
		categoria: 'data-engineering',
		fecha: '2026-10-25',
		tags: ['Iquitos Data Fest', 'Historia', 'Plataformas', 'IA'],
		slides: 26,
	},
	{
		slug: 'del-papel-a-la-ia',
		titulo: 'Del papel a la IA',
		descripcion: {
			es: 'La evolución de los datos: de las tablillas y el quipu a los agentes de IA, las plataformas de 2026, los roles y cómo empezar.',
			en: 'The evolution of data: from clay tablets to AI agents, the 2026 platforms, data roles and how to get started.',
		},
		categoria: 'data-engineering',
		fecha: '2026-10-25',
		tags: ['Historia', 'Plataformas', 'Roles', 'IA'],
		slides: 26,
		destacada: true,
	},
	{
		slug: 'databricks-para-todos',
		titulo: 'Databricks para todos',
		descripcion: {
			es: 'La plataforma que revolucionó los datos y ahora la IA: historia, stack 2026 interactivo, roles, industrias y cómo cobra.',
			en: 'The platform that revolutionized data and now AI: history, interactive 2026 stack, roles, industries and pricing.',
		},
		categoria: 'databricks',
		fecha: '2026-10-24',
		tags: ['Lakehouse', 'Unity Catalog', 'Agent Bricks', 'Genie'],
		slides: 24,
		destacada: true,
	},
];

export const ordenadas = () => [...PRESENTACIONES].sort((a, b) => b.fecha.localeCompare(a.fecha));
