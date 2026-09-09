import {
  User,
  LibraryFile,
  CommunityPost,
  LessonBooking,
  ChatMessage,
  NotificationItem,
  Review,
  ReportItem,
  Course
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-student-1',
    name: 'Américo Machava',
    email: 'americo.machava@isps.ac.mz',
    phone: '+258 84 123 4567',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    institution: 'Instituto Superior Politécnico de Songo (ISPS)',
    course: 'Engenharia Elétrica',
    yearSemester: '3º Ano / 1º Semestre',
    bio: 'Estudante de Engenharia Elétrica no ISPS Songo. Apaixonado por energias renováveis, automação e circuitos elétricos.',
    location: 'Songo, Tete',
    createdAt: '2025-02-10'
  },
  {
    id: 'user-tutor-1',
    name: 'Eng. Tomás Chivambo',
    email: 'tomas.chivambo@isps.ac.mz',
    phone: '+258 82 987 6543',
    role: 'tutor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    institution: 'ISPS - Departamento de Engenharia Elétrica',
    course: 'Engenharia Eletrotécnica e de Potência',
    yearSemester: 'Docente & Explicador',
    bio: 'Engenheiro Eletrotécnico com 6 anos de experiência em docência no ISPS Songo e consultoria em centrais hidroelétricas (HCB). Especialista em Análise de Circuitos, Máquinas Elétricas e Sistemas de Potência.',
    location: 'Songo, Cahora Bassa',
    isVerified: true,
    mainSubject: 'Engenharia Elétrica',
    subjects: ['Engenharia Elétrica', 'Circuitos Elétricos', 'Máquinas Elétricas', 'Física II', 'Eletricidade'],
    hourlyRateMzn: 450,
    teachingMode: 'both',
    experienceYears: 6,
    availableSchedule: ['Seg 16h-20h', 'Qua 16h-20h', 'Sex 14h-18h', 'Sáb 09h-13h'],
    certificates: ['Mestrado em Engenharia Elétrica (UEM)', 'Certificação em Alta Tensão', 'Docente Distinto ISPS 2024'],
    rating: 4.9,
    reviewCount: 38,
    studentCount: 142,
    onlineStatus: 'online',
    createdAt: '2024-03-15'
  },
  {
    id: 'user-tutor-2',
    name: 'Profa. Carla Macamo',
    email: 'carla.macamo@edu.mz',
    phone: '+258 84 555 1212',
    role: 'tutor',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    institution: 'Faculdade de Ciências',
    course: 'Matemática Aplicada & Estatística',
    bio: 'Mestre em Matemática Pura e Aplicada. Dedico-me a desmistificar o Cálculo Diferencial, Integral e a Álgebra Linear com métodos visuais, exercícios práticos e resolução passo a passo.',
    location: 'Maputo / Online para todo Moçambique',
    isVerified: true,
    mainSubject: 'Matemática',
    subjects: ['Matemática', 'Cálculo I', 'Cálculo II', 'Álgebra Linear', 'Estatística'],
    hourlyRateMzn: 400,
    teachingMode: 'online',
    experienceYears: 8,
    availableSchedule: ['Ter 17h-21h', 'Qui 17h-21h', 'Sáb 14h-18h', 'Dom 09h-12h'],
    certificates: ['Licenciatura em Ensino de Matemática', 'Mestrado em Análise Numérica'],
    rating: 5.0,
    reviewCount: 64,
    studentCount: 210,
    onlineStatus: 'online',
    createdAt: '2024-01-20'
  },
  {
    id: 'user-tutor-3',
    name: 'Eng. Zacarias Langa',
    email: 'zacarias.langa@isps.ac.mz',
    phone: '+258 86 333 4444',
    role: 'tutor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    institution: 'ISPS - Departamento de Eletrónica',
    course: 'Engenharia Eletrónica & Automação',
    bio: 'Instrutor prático focado em Eletrónica Analógica e Digital, microcontroladores (Arduino, STM32, PIC) e sistemas embarcados. Apoio no desenvolvimento de projetos de fim de curso.',
    location: 'Songo / Tete',
    isVerified: true,
    mainSubject: 'Eletrónica',
    subjects: ['Eletrónica', 'Eletrónica Digital', 'Sistemas Embarcados', 'Automação', 'Programação'],
    hourlyRateMzn: 500,
    teachingMode: 'both',
    experienceYears: 5,
    availableSchedule: ['Seg 18h-21h', 'Ter 18h-21h', 'Qui 18h-21h', 'Sáb 10h-16h'],
    certificates: ['Engenheiro Eletrónico Registado na Ordem dos Engenheiros de Moçambique (OrdEM)'],
    rating: 4.8,
    reviewCount: 29,
    studentCount: 95,
    onlineStatus: 'offline',
    createdAt: '2024-05-12'
  },
  {
    id: 'user-tutor-4',
    name: 'Nelson Mondlane',
    email: 'nelson.mondlane@tech.mz',
    phone: '+258 87 777 8899',
    role: 'tutor',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    institution: 'Tech Mozambique Academy',
    course: 'Ciência da Computação',
    bio: 'Desenvolvedor Full Stack Sênior e explicador de Programação (Python, C, C++, JavaScript, TypeScript, SQL). Ensino desde lógica elementar até arquitetura de software.',
    location: 'Online',
    isVerified: true,
    mainSubject: 'Programação',
    subjects: ['Programação', 'Informática', 'Algoritmos', 'Python', 'C/C++', 'Bancos de Dados'],
    hourlyRateMzn: 450,
    teachingMode: 'online',
    experienceYears: 4,
    availableSchedule: ['Seg a Sex 19h-22h', 'Sáb 10h-18h'],
    certificates: ['Full Stack Certified Engineer', 'Python Institute PCAP'],
    rating: 4.95,
    reviewCount: 47,
    studentCount: 130,
    onlineStatus: 'online',
    createdAt: '2024-06-01'
  },
  {
    id: 'user-tutor-5',
    name: 'Dr. Hermenegildo Sitoe',
    email: 'hermenegildo.sitoe@isps.ac.mz',
    phone: '+258 84 111 2233',
    role: 'tutor',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    institution: 'ISPS - Departamento de Mecânica',
    course: 'Física Geral e Mecânica dos Fluidos',
    bio: 'Docente universitário especialista em Física Geral, Mecânica Clássica, Termodinâmica e Mecânica dos Fluidos aplicada a turbinas hidráulicas.',
    location: 'Songo, Tete',
    isVerified: false,
    mainSubject: 'Física',
    subjects: ['Física', 'Termodinâmica', 'Mecânica dos Fluidos', 'Resistência dos Materiais'],
    hourlyRateMzn: 350,
    teachingMode: 'both',
    experienceYears: 7,
    availableSchedule: ['Qua 15h-19h', 'Sex 15h-19h', 'Sáb 08h-12h'],
    certificates: ['Doutorando em Energia e Ambiente'],
    rating: 4.85,
    reviewCount: 22,
    studentCount: 88,
    onlineStatus: 'offline',
    createdAt: '2024-08-10'
  },
  {
    id: 'user-tutor-6',
    name: 'Beatriz Cossa',
    email: 'beatriz.cossa@financas.mz',
    phone: '+258 85 999 0011',
    role: 'tutor',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    institution: 'Instituto Superior de Contabilidade e Auditoria',
    course: 'Contabilidade e Finanças',
    bio: 'Auditora e explicadora de Contabilidade Geral, Contabilidade Financeira, Gestão Orçamental e Fiscalidade Moçambicana (IRPS, IRPC, IVA).',
    location: 'Beira / Online',
    isVerified: true,
    mainSubject: 'Contabilidade',
    subjects: ['Contabilidade', 'Gestão', 'Economia', 'Fiscalidade'],
    hourlyRateMzn: 380,
    teachingMode: 'online',
    experienceYears: 4,
    availableSchedule: ['Ter 18h-21h', 'Qui 18h-21h', 'Sáb 09h-15h'],
    certificates: ['Contabilista Certificada pela OCAM'],
    rating: 4.7,
    reviewCount: 19,
    studentCount: 65,
    onlineStatus: 'online',
    createdAt: '2024-09-01'
  },
  {
    id: 'user-admin-1',
    name: 'Dra. Fátima Sitoe',
    email: 'admin@ispsdark.ac.mz',
    phone: '+258 84 000 0001',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&auto=format&fit=crop&q=80',
    institution: 'ISPS Dark - Direção Acadêmica',
    course: 'Administração da Plataforma',
    bio: 'Administradora e Coordenadora Acadêmica da plataforma ISPS Dark. Supervisão de conformidade, verificação de explicadores e qualidade de conteúdos.',
    location: 'Songo, Tete, Moçambique',
    createdAt: '2024-01-01'
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-1',
    code: 'ENG-ELET',
    name: 'Engenharia Elétrica e de Potência',
    degree: 'Licenciatura',
    department: 'Departamento de Engenharia Elétrica',
    durationYears: 5,
    coordinator: 'Eng. Tomás Chivambo',
    description: 'Formação especializada em geração, transmissão e distribuição de energia elétrica, máquinas elétricas industriais e redes de alta potência.',
    subjects: ['Circuitos Elétricos I & II', 'Máquinas Elétricas', 'Sistemas de Potência', 'Eletrónica de Potência', 'Alta Tensão'],
    activeStudentsCount: 184,
    iconName: 'Zap',
    createdAt: '2024-01-15'
  },
  {
    id: 'course-2',
    code: 'ENG-HID',
    name: 'Engenharia Hidráulica e Recursos Hídricos',
    degree: 'Licenciatura',
    department: 'Departamento de Engenharia Hidráulica e Ambiente',
    durationYears: 5,
    coordinator: 'Prof. Dr. Hermenegildo Sitoe',
    description: 'Foco na infraestrutura do Vale do Zambeze e Cahora Bassa: barragens, centrais hidroelétricas, mecânica dos fluidos e gestão de bacias hidrográficas.',
    subjects: ['Mecânica dos Fluidos', 'Hidrologia Aplicada', 'Obras Hidráulicas', 'Turbinas Hidráulicas', 'Saneamento Básico'],
    activeStudentsCount: 142,
    iconName: 'Waves',
    createdAt: '2024-01-20'
  },
  {
    id: 'course-3',
    code: 'ENG-MEC',
    name: 'Engenharia Mecânica Industrial',
    degree: 'Licenciatura',
    department: 'Departamento de Mecânica e Termotecnia',
    durationYears: 5,
    coordinator: 'Eng. Nelson Mondlane',
    description: 'Especialização em manutenção industrial pesada, termodinâmica aplicada, processos de fabricação mecânica e sistemas de refrigeração industrial.',
    subjects: ['Termodinâmica I & II', 'Resistência dos Materiais', 'Elementos de Máquinas', 'Transferência de Calor', 'Manutenção Industrial'],
    activeStudentsCount: 120,
    iconName: 'Cog',
    createdAt: '2024-02-01'
  },
  {
    id: 'course-4',
    code: 'ENG-INF',
    name: 'Engenharia Informática e Redes',
    degree: 'Licenciatura',
    department: 'Departamento de Tecnologias de Informação',
    durationYears: 4,
    coordinator: 'Eng. Zacarias Langa',
    description: 'Desenvolvimento de software moderno, arquitetura de redes de alta velocidade, segurança cibernética e automação com sistemas embarcados.',
    subjects: ['Algoritmos e Estruturas de Dados', 'Programação Web e Móvel', 'Redes de Computadores', 'Bases de Dados', 'Segurança de Redes'],
    activeStudentsCount: 195,
    iconName: 'Code',
    createdAt: '2024-02-15'
  },
  {
    id: 'course-5',
    code: 'CGF',
    name: 'Contabilidade e Gestão Financeira',
    degree: 'Licenciatura',
    department: 'Departamento de Gestão e Economia',
    durationYears: 4,
    coordinator: 'Dra. Beatriz Cossa',
    description: 'Preparação de quadros superiores para auditoria contábil, planeamento orçamental, fiscalidade moçambicana e gestão financeira empresarial.',
    subjects: ['Contabilidade Geral I & II', 'Contabilidade de Custos', 'Fiscalidade Moçambicana', 'Auditoria Financeira', 'Gestão Orçamental'],
    activeStudentsCount: 110,
    iconName: 'FileSpreadsheet',
    createdAt: '2024-03-01'
  }
];

export const POPULAR_SUBJECTS = [
  { id: 'matematica', name: 'Matemática', icon: 'Calculator', count: 42, color: 'from-amber-500/20 to-orange-500/10 text-amber-400' },
  { id: 'eletrotecnica', name: 'Engenharia Elétrica', icon: 'Zap', count: 38, color: 'from-yellow-500/20 to-amber-500/10 text-yellow-400' },
  { id: 'fisica', name: 'Física', icon: 'Atom', count: 31, color: 'from-blue-500/20 to-cyan-500/10 text-blue-400' },
  { id: 'eletronica', name: 'Eletrónica', icon: 'Cpu', count: 26, color: 'from-emerald-500/20 to-teal-500/10 text-emerald-400' },
  { id: 'programacao', name: 'Programação', icon: 'Code', count: 45, color: 'from-indigo-500/20 to-purple-500/10 text-indigo-400' },
  { id: 'mecanica', name: 'Engenharia Mecânica', icon: 'Cog', count: 24, color: 'from-rose-500/20 to-pink-500/10 text-rose-400' },
  { id: 'contabilidade', name: 'Contabilidade', icon: 'FileSpreadsheet', count: 20, color: 'from-green-500/20 to-emerald-500/10 text-green-400' },
  { id: 'quimica', name: 'Química', icon: 'FlaskConical', count: 18, color: 'from-violet-500/20 to-fuchsia-500/10 text-violet-400' },
  { id: 'ingles', name: 'Inglês Técnico', icon: 'Languages', count: 22, color: 'from-sky-500/20 to-blue-500/10 text-sky-400' },
  { id: 'gestao', name: 'Gestão & Economia', icon: 'TrendingUp', count: 19, color: 'from-amber-500/20 to-yellow-500/10 text-amber-300' }
];

export const LIBRARY_CATEGORIES = [
  'Todos',
  'Matemática',
  'Física',
  'Química',
  'Engenharia',
  'Eletricidade',
  'Eletrónica',
  'Informática',
  'Programação',
  'Economia',
  'Contabilidade',
  'Gestão',
  'Direito',
  'Línguas',
  'Exames',
  'Testes',
  'Apontamentos',
  'Livros',
  'Trabalhos acadêmicos'
];

export const INITIAL_LIBRARY_FILES: LibraryFile[] = [
  {
    id: 'file-1',
    title: 'Apontamentos Completos de Cálculo I: Limites, Derivadas e Aplicações',
    description: 'Sebenta acadêmica completa com teoria detalhada, fórmulas essenciais e mais de 80 exercícios práticos resolvidos passo a passo para o 1º ano de Engenharia.',
    authorId: 'user-tutor-2',
    authorName: 'Profa. Carla Macamo',
    category: 'Matemática',
    format: 'pdf',
    pageCount: 148,
    fileSize: '4.8 MB',
    rating: 4.95,
    reviewCount: 42,
    downloadsCount: 1280,
    priceMzn: 0, // GRÁTIS
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&auto=format&fit=crop&q=80',
    tags: ['Cálculo I', 'Limites', 'Derivadas', 'ISPS', 'Engenharia'],
    previewPagesSnippet: [
      'Capítulo 1: Noções Fundamentais e Propriedades dos Limites',
      'Definição formal de limite segundo Cauchy e Weierstrass. Exemplos ilustrativos com funções racionais e irracionais.',
      'Teorema do Confronto (Sandwich Theorem) e limites trigonométricos notáveis (lim x->0 sen(x)/x = 1).',
      'Capítulo 2: Derivadas e Regras de Derivação (Regra do Produto, Quociente e da Cadeia).'
    ],
    previewSummary: 'Documento público gratuito aberto a todos os estudantes do ISPS e de outras universidades.',
    isApproved: true,
    createdAt: '2025-01-10'
  },
  {
    id: 'file-2',
    title: 'Manual de Laboratório de Máquinas Elétricas & Transformadores',
    description: 'Roteiro prático das aulas de laboratório do ISPS Songo. Ensaios em vazio e em curto-circuito de transformadores monofásicos e trifásicos, e motores de indução.',
    authorId: 'user-tutor-1',
    authorName: 'Eng. Tomás Chivambo',
    category: 'Eletricidade',
    format: 'pdf',
    pageCount: 94,
    fileSize: '3.6 MB',
    rating: 4.88,
    reviewCount: 29,
    downloadsCount: 950,
    priceMzn: 0, // GRÁTIS
    coverImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&auto=format&fit=crop&q=80',
    tags: ['Máquinas Elétricas', 'Transformadores', 'Laboratório ISPS', 'Potência'],
    previewPagesSnippet: [
      'Ensaio 1: Determinação dos parâmetros do circuito equivalente do transformador.',
      'Ensaio 2: Características de regulação de tensão e rendimento.',
      'Ensaio 3: Partida estrela-triângulo de motor assíncrono trifásico.'
    ],
    previewSummary: 'Guia oficial distribuído para suporte às bancadas de ensaio do ISPS Songo.',
    isApproved: true,
    createdAt: '2025-01-22'
  },
  {
    id: 'file-3',
    title: 'Guia Definitivo de Dimensionamento de Instalações Elétricas Industriais',
    description: 'Manual de nível profissional com projeto completo de instalação em baixa e média tensão: quadros elétricos, condutores, disjuntores, compensação do fator de potência e proteção.',
    authorId: 'user-tutor-1',
    authorName: 'Eng. Tomás Chivambo',
    category: 'Engenharia',
    format: 'pdf',
    pageCount: 220,
    fileSize: '8.4 MB',
    rating: 4.98,
    reviewCount: 56,
    downloadsCount: 420,
    priceMzn: 350, // PREMIUM PAGO
    coverImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80',
    tags: ['Instalações Elétricas', 'Baixa Tensão', 'Projetos', 'Dimensionamento', 'Média Tensão'],
    previewPagesSnippet: [
      'Seção 1: Critérios de dimensionamento de cabos por capacidade de condução de corrente e queda de tensão.',
      'Seção 2: Cálculo de correntes de curto-circuito simétricas e assimétricas.',
      'Seção 3: Seleção e coordenação de disjuntores e fusíveis segundo normas IEC.'
    ],
    previewSummary: 'Arquivo premium pago. Requer compra via M-Pesa ou E-Mola para desbloquear e baixar o PDF na íntegra.',
    isApproved: true,
    createdAt: '2025-02-05'
  },
  {
    id: 'file-4',
    title: 'Coletânea de Exames Resolvidos: Eletrónica Digital & Circuitos Lógicos (2020-2025)',
    description: 'Resolução detalhada dos exames normais, de recorrência e testes do ISPS com diagramas de blocos, mapas de Karnaugh, Flip-Flops e projetos de contadores síncronos.',
    authorId: 'user-tutor-3',
    authorName: 'Eng. Zacarias Langa',
    category: 'Eletrónica',
    format: 'pdf',
    pageCount: 160,
    fileSize: '6.1 MB',
    rating: 4.9,
    reviewCount: 33,
    downloadsCount: 680,
    priceMzn: 250, // PREMIUM PAGO
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=80',
    tags: ['Eletrónica Digital', 'Exames ISPS', 'Karnaugh', 'Contadores', 'Testes Resolvidos'],
    previewPagesSnippet: [
      'Exame Normal 2024: Questão 1 - Simplificação de funções booleanas usando Mapa de Karnaugh de 4 e 5 variáveis.',
      'Questão 2 - Projeto de um contador síncrono módulo 12 com flip-flops JK.',
      'Questão 3 - Implementação de multiplexador 8:1 com portas lógicas NAND universais.'
    ],
    previewSummary: 'Excelente material de revisão com soluções comentadas para preparação para exames.',
    isApproved: true,
    createdAt: '2025-02-14'
  },
  {
    id: 'file-5',
    title: 'Manual Prático: Programação em C e Estruturas de Dados para Engenharia',
    description: 'Aborda ponteiros, alocação dinâmica de memória, listas ligadas, pilhas, filas, árvores binárias e implementação de algoritmos de ordenação com exemplos comentados.',
    authorId: 'user-tutor-4',
    authorName: 'Nelson Mondlane',
    category: 'Programação',
    format: 'pdf',
    pageCount: 135,
    fileSize: '4.2 MB',
    rating: 4.86,
    reviewCount: 24,
    downloadsCount: 890,
    priceMzn: 0, // GRÁTIS
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=80',
    tags: ['Programação C', 'Estrutura de Dados', 'Ponteiros', 'Algoritmos'],
    previewPagesSnippet: [
      'Capítulo 3: Ponteiros e manipulação direta de memória no padrão ANSI C.',
      'Capítulo 4: Listas encadeadas simples e duplamente encadeadas com exemplos de inserção e exclusão.',
      'Capítulo 5: Tratamento de arquivos binários e structs.'
    ],
    previewSummary: 'Material gratuito com códigos-fonte testados em GCC.',
    isApproved: true,
    createdAt: '2025-02-18'
  },
  {
    id: 'file-6',
    title: 'Guia de Contabilidade Financeira e Normas de Relato Financeiro em Moçambique',
    description: 'Guia explicativo das NIRF/PGCM, Demonstração de Resultados, Balanço Patrimonial, Fluxos de Caixa e lançamentos contábeis típicos com exercícios.',
    authorId: 'user-tutor-6',
    authorName: 'Beatriz Cossa',
    category: 'Contabilidade',
    format: 'pdf',
    pageCount: 175,
    fileSize: '5.5 MB',
    rating: 4.75,
    reviewCount: 18,
    downloadsCount: 310,
    priceMzn: 200, // PREMIUM PAGO
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
    tags: ['Contabilidade', 'NIRF', 'Balanço', 'Finanças', 'Fiscalidade'],
    previewPagesSnippet: [
      'Capítulo 1: Enquadramento do Sistema de Contabilidade para o Setor Empresarial em Moçambique (SCE).',
      'Capítulo 2: Registo de Operações Correntes e de Fim de Exercício.',
      'Capítulo 3: Apuramento do Imposto sobre o Rendimento das Pessoas Coletivas (IRPC).'
    ],
    previewSummary: 'Arquivo premium contendo modelos de mapas contábeis e exercícios práticos.',
    isApproved: true,
    createdAt: '2025-02-25'
  }
];

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    authorId: 'user-student-1',
    authorName: 'Américo Machava',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    authorRole: 'student',
    type: 'question',
    title: 'Como resolver esta equação diferencial de 2ª ordem com coeficientes constantes em Circuitos RLC?',
    content: 'Caros colegas e explicadores, estou a estudar a resposta transitória de um circuito RLC série sob degrau unitário: L*(d²i/dt²) + R*(di/dt) + (1/C)*i = 0. Como identifico de forma rápida e sistemática as condições de amortecimento crítico vs subamortecido sem errar os sinais da equação característica?',
    subjectTag: 'Circuitos Elétricos',
    tags: ['RLC', 'Equações Diferenciais', 'Transitórios', 'Cálculo II'],
    likesCount: 14,
    likedByUserIds: ['user-tutor-1', 'user-tutor-2'],
    commentsCount: 2,
    isSolved: true,
    bestAnswerId: 'comment-1',
    reportsCount: 0,
    isApproved: true,
    createdAt: '2025-03-05 10:30',
    comments: [
      {
        id: 'comment-1',
        postId: 'post-1',
        authorId: 'user-tutor-1',
        authorName: 'Eng. Tomás Chivambo',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        authorRole: 'tutor',
        isTutorVerified: true,
        content: 'Olá Américo! A regra de ouro é calcular o fator de amortecimento alfa = R / (2L) e a frequência de ressonância não amortecida ômega_0 = 1 / sqrt(L*C).\n\n1. Se alfa > ômega_0 -> Sobreamortecido (raízes reais distintas: s1, s2).\n2. Se alfa = ômega_0 -> Criticamente amortecido (raízes reais iguais: s1 = s2 = -alfa).\n3. Se alfa < ômega_0 -> Subamortecido (raízes complexas conjugadas: -alfa ± j*ômega_d).\n\nRecomendo sempre verificar as unidades no SI antes de montar a equação!',
        likesCount: 9,
        isBestAnswer: true,
        createdAt: '2025-03-05 11:15'
      },
      {
        id: 'comment-2',
        postId: 'post-1',
        authorId: 'user-tutor-2',
        authorName: 'Profa. Carla Macamo',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
        authorRole: 'tutor',
        isTutorVerified: true,
        content: 'Excelente explicação do Eng. Tomás! Do ponto de vista estritamente matemático, a equação característica é s² + (R/L)s + 1/(LC) = 0. O discriminante delta = (R/L)² - 4/(LC) define diretamente o sinal.',
        likesCount: 5,
        createdAt: '2025-03-05 12:40'
      }
    ]
  },
  {
    id: 'post-2',
    authorId: 'user-tutor-1',
    authorName: 'Eng. Tomás Chivambo',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    authorRole: 'tutor',
    isTutorVerified: true,
    type: 'summary',
    title: 'Resumo Prático: Leis de Kirchhoff e Método das Malhas e Nós (PDF incluído)',
    content: 'Para os estudantes que têm testes nesta semana no ISPS Songo, preparei uma síntese em 2 páginas com o método infalível para montar o sistema de matrizes de malha sem errar polaridades de fontes dependentes e nós de referência. Consultem também a biblioteca digital para o manual prático completo!',
    subjectTag: 'Engenharia Elétrica',
    tags: ['Kirchhoff', 'Método dos Nós', 'Resumo', 'Dica de Estudo'],
    likesCount: 28,
    likedByUserIds: ['user-student-1'],
    commentsCount: 1,
    reportsCount: 0,
    isApproved: true,
    createdAt: '2025-03-06 09:10',
    comments: [
      {
        id: 'comment-3',
        postId: 'post-2',
        authorId: 'user-student-1',
        authorName: 'Américo Machava',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        authorRole: 'student',
        content: 'Muito obrigado Eng. Tomás! Esse resumo esclareceu exatamente a questão do nó de referência que caiu no mini-teste passado.',
        likesCount: 3,
        createdAt: '2025-03-06 10:00'
      }
    ]
  },
  {
    id: 'post-3',
    authorId: 'user-tutor-4',
    authorName: 'Nelson Mondlane',
    authorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    authorRole: 'tutor',
    isTutorVerified: true,
    type: 'study_tip',
    title: '5 Dicas essenciais para dominar Ponteiros em C sem "Segmentation Fault"',
    content: '1. Inicialize SEMPRE ponteiros com NULL;\n2. Nunca desreferencie um ponteiro sem antes testar if (ptr != NULL);\n3. Toda alocação com malloc/calloc deve ter seu respectivo free();\n4. Desenhe no caderno as caixas de memória com os endereços hexadecimais;\n5. Utilize o Valgrind para verificar fugas de memória (memory leaks).',
    subjectTag: 'Programação',
    tags: ['C', 'Ponteiros', 'Dicas', 'Ciência da Computação'],
    likesCount: 35,
    likedByUserIds: [],
    commentsCount: 0,
    reportsCount: 0,
    isApproved: true,
    createdAt: '2025-03-06 14:20',
    comments: []
  }
];

export const INITIAL_LESSONS: LessonBooking[] = [
  {
    id: 'lesson-1',
    studentId: 'user-student-1',
    studentName: 'Américo Machava',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    studentPhone: '+258 84 123 4567',
    tutorId: 'user-tutor-1',
    tutorName: 'Eng. Tomás Chivambo',
    tutorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    subject: 'Engenharia Elétrica - Análise de Circuitos Trifásicos',
    date: '2025-03-10',
    time: '17:00',
    durationMinutes: 90,
    priceMzn: 675,
    status: 'accepted',
    teachingMode: 'online',
    meetingLink: 'https://ispsdark.ac.mz/sala-aula/live-7819',
    notes: 'Preparação para o teste 2 do ISPS: conexões triângulo-estrela e cálculo de potências ativa, reativa e aparente.',
    rated: false,
    createdAt: '2025-03-04'
  },
  {
    id: 'lesson-2',
    studentId: 'user-student-1',
    studentName: 'Américo Machava',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    studentPhone: '+258 84 123 4567',
    tutorId: 'user-tutor-2',
    tutorName: 'Profa. Carla Macamo',
    tutorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    subject: 'Matemática - Integrais Triplas e Coordenadas Cilíndricas',
    date: '2025-03-12',
    time: '18:30',
    durationMinutes: 60,
    priceMzn: 400,
    status: 'pending',
    teachingMode: 'online',
    notes: 'Revisão das transformações de jacobiano e cálculo de volumes no espaço.',
    createdAt: '2025-03-06'
  }
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'user-student-1',
    senderName: 'Américo Machava',
    senderRole: 'student',
    recipientId: 'user-tutor-1',
    text: 'Boa tarde Eng. Tomás! Gostaria de tirar uma dúvida sobre a nossa próxima explicação de circuitos trifásicos. O senhor recomenda que eu resolva a ficha 4 com antecedência?',
    timestamp: '15:20',
    isRead: true
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: 'user-tutor-1',
    senderName: 'Eng. Tomás Chivambo',
    senderRole: 'tutor',
    recipientId: 'user-student-1',
    text: 'Olá Américo! Sim, excelente iniciativa. Tente resolver especialmente os exercícios 3 e 5 da ficha 4. Na aula vamos focar na compensação de fator de potência com baterias de condensadores.',
    timestamp: '15:25',
    isRead: true
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'user-student-1',
    title: 'Aula Confirmada!',
    message: 'Eng. Tomás Chivambo aceitou a sua solicitação de explicação para 10 de Março às 17:00.',
    type: 'lesson_accepted',
    isRead: false,
    link: 'dashboard',
    createdAt: 'Hoje às 15:30'
  },
  {
    id: 'notif-2',
    userId: 'user-student-1',
    title: 'Nova resposta na sua pergunta',
    message: 'Eng. Tomás Chivambo respondeu à sua questão sobre circuitos RLC na Comunidade.',
    type: 'new_reply',
    isRead: false,
    link: 'community',
    createdAt: 'Ontem às 11:15'
  },
  {
    id: 'notif-3',
    userId: 'user-student-1',
    title: 'Novo material na Biblioteca ISPS',
    message: 'Foi adicionada a coletânea de exames resolvidos de Eletrónica Digital.',
    type: 'new_file',
    isRead: true,
    link: 'library',
    createdAt: 'Há 2 dias'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    targetType: 'tutor',
    targetId: 'user-tutor-1',
    authorId: 'user-student-1',
    authorName: 'Américo Machava',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Explicador de altíssimo nível no ISPS! Tem grande domínio prático dos sistemas elétricos e explica de forma extremamente paciente e didática.',
    createdAt: '2025-02-28'
  },
  {
    id: 'rev-2',
    targetType: 'tutor',
    targetId: 'user-tutor-2',
    authorId: 'user-student-1',
    authorName: 'Américo Machava',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'A Profa. Carla é incrível para Cálculo. Graças às aulas dela consegui dispensar a cadeira com 16 valores.',
    createdAt: '2025-01-15'
  }
];

export const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'rep-1',
    reporterId: 'user-student-1',
    targetType: 'post',
    targetId: 'post-test',
    targetTitle: 'Divulgação de link suspeito',
    reason: 'Spam e link não acadêmico postado em comentário.',
    status: 'pending',
    createdAt: '2025-03-04'
  }
];
