/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  UserProfile,
  BarterItem,
  ClimateWarning,
  CommunityGroup,
  ForumPost,
  Conversation,
  NeighborReview
} from '../types';

export const initialCurrentUser: UserProfile = {
  id: 'user_joao',
  name: 'João Silva',
  email: 'joao.silva@rural.org.br',
  phone: '(19) 98765-4321',
  avatarUrl: '/src/assets/images/farmer_joao_avatar_1794017308636.jpg',
  farmName: 'Sítio Boa Vista',
  municipality: 'Brotas',
  state: 'SP',
  locationDetails: 'Estrada do Barreiro, km 12 - Zona Rural',
  isLocationPrivate: true,
  farmSizeHectares: 12.5,
  whatProduces: 'Milho Caiano, Feijão Fradinho, Mandioca Manteiga e Hortaliças Agroecológicas',
  sustainablePractices: [
    'Compostagem Orgânica',
    'Plantio Direto',
    'Adubação Verde',
    'Rotação de Culturas'
  ],
  reputationAverage: 4.9,
  totalRecommendations: 7,
  badges: ['Vizinho de Confiança', 'Sementes Crioulas', 'Parceiro Pontual'],
  joinedDate: 'Fevereiro de 2025'
};

export const initialReviews: NeighborReview[] = [
  {
    id: 'rev_1',
    authorId: 'user_antonio',
    authorName: 'Antônio Carlos',
    authorAvatar: '/src/assets/images/farmer_antonio_avatar_1794017309678.jpg',
    targetUserId: 'user_joao',
    rating: 5,
    comment: 'Troquei 2 horas de arado com meu trator por 3 sacos de sementes selecionadas do João. Sementes com taxa de germinação excelente! Vizinho prestativo e de palavra.',
    tradeSummary: 'Serviço de Trator ⇄ Sementes de Milho Caiano',
    date: 'Ontem',
    badgesGiven: ['Honesto', 'Sementes Excelentes', 'Boa Comunicação']
  },
  {
    id: 'rev_2',
    authorId: 'user_maria',
    authorName: 'Maria Oliveira',
    authorAvatar: '/src/assets/images/farmer_maria_avatar_1794017310176.jpg',
    targetUserId: 'user_joao',
    rating: 5,
    comment: 'O João me forneceu composto orgânico de ótima qualidade em troca de mudas da minha estufa. Tudo muito transparente e na boa vizinhança.',
    tradeSummary: 'Composto Orgânico ⇄ Mudas de Alface & Rúcula',
    date: 'Semana passada',
    badgesGiven: ['Insumo de Qualidade', 'Pontual']
  },
  {
    id: 'rev_3',
    authorId: 'user_jose',
    authorName: 'José Pedro',
    authorAvatar: '/src/assets/images/farmer_joao_avatar_1794017308636.jpg',
    targetUserId: 'user_joao',
    rating: 5,
    comment: 'Concluímos o empréstimo da roçadeira manual por 10kg de mandioca fresca. Equipamento voltou limpinho e lubrificado.',
    tradeSummary: 'Roçadeira Manual ⇄ Mandioca Manteiga',
    date: 'Há 2 semanas',
    badgesGiven: ['Cuidado com Equipamento', 'Recomendado']
  }
];

export const initialClimateWarnings: ClimateWarning[] = [
  {
    id: 'warn_frost',
    title: 'Alerta de Geada Moderada a Severa',
    severity: 'emergencia',
    description: 'Frente fria polar atingirá a bacia do Jacaré-Guaçu na madrugada de quinta para sexta. Temperatura mínima prevista de 2°C na baixada com formação de geada na relva.',
    targetRegion: 'Brotas, Torrinha e Dois Córregos (SP)',
    validUntil: 'Válido até 08/11 às 08h',
    usefulVotes: 34,
    unconfirmedVotes: 2,
    recommendations: [
      'Cobrir canteiros de hortaliças sensíveis com sombrite duplo ou manta térmica',
      'Manter o solo úmido ao entardecer para reter calor térmico',
      'Abrigar mudas recém-transplantadas e proteger pomares jovens com palhada'
    ],
    iconType: 'frost'
  },
  {
    id: 'warn_pest',
    title: 'Aviso Fitosanitário: Surto de Lagarta-do-Cartucho',
    severity: 'alerta',
    description: 'Três sítios vizinhos no raio de 8km relataram foco de Spodoptera frugiperda em lavouras de milho safrinha.',
    targetRegion: 'Zona Rural Leste - Raio de 10km',
    validUntil: 'Monitoramento contínuo',
    usefulVotes: 19,
    unconfirmedVotes: 1,
    recommendations: [
      'Inspecionar diariamente o cartucho das plantas com 20 a 30 dias',
      'Priorizar controle biológico com Bacillus thuringiensis (Bt) ou liberação de Trichogramma',
      'Compartilhar armadilhas de feromônio com vizinhos para monitoramento coletivo'
    ],
    iconType: 'pest'
  }
];

export const initialCommunityGroups: CommunityGroup[] = [
  {
    id: 'grp_geral',
    name: 'Geral (Nossa Região Rural)',
    description: 'Espaço aberto para todos os pequenos agricultores de Brotas, Torrinha e região vizinha.',
    region: 'Vale do Rio Jacaré-Guaçu',
    cropType: 'Diversificada',
    memberCount: 142,
    isMember: true,
    avatarIcon: '🌱'
  },
  {
    id: 'grp_organicos',
    name: 'Hortaliças & Agroecologia Familiar',
    description: 'Dicas sobre compostagem, biofertilizantes, calda bordalesa e cultivo sem veneno.',
    region: 'Circuito das Colinas',
    cropType: 'Hortifruti Orgânico',
    memberCount: 88,
    isMember: true,
    avatarIcon: '🥬'
  },
  {
    id: 'grp_soja_milho',
    name: 'Cultivadores de Soja & Grãos',
    description: 'Compartilhamento de maquinário, plantio direto, rotação com braquiária e manejo de solo.',
    region: 'Centro-Oeste Paulista',
    cropType: 'Grãos e Cereais',
    memberCount: 65,
    isMember: false,
    avatarIcon: '🌽'
  },
  {
    id: 'grp_cafe',
    name: 'Cafeicultura Familiar & Terreiro',
    description: 'Troca de insumos para colheita, peneiras, secagem em terreiro e mudas clonais.',
    region: 'Serra do Itaqueri',
    cropType: 'Café Arábica',
    memberCount: 53,
    isMember: false,
    avatarIcon: '☕'
  }
];

export const initialBarterItems: BarterItem[] = [
  {
    id: 'item_sprayer',
    userId: 'user_antonio',
    userName: 'Antônio Carlos',
    userAvatar: '/src/assets/images/farmer_antonio_avatar_1794017309678.jpg',
    userLocation: 'Sítio Recanto Verde (Brotas)',
    distanceKm: 2.3,
    title: 'Bomba de Pulverização Costal Manual 20L',
    category: 'ferramentas',
    description: 'Bomba Jacto costal em ótimo estado, bicos leque novos instalados, alças acolchoadas. Não estou usando nesta safra.',
    imageUrl: '/src/assets/images/escambo_pulverizador_1794017311348.jpg',
    acceptsInReturn: 'Adubo orgânico, mudas frutíferas (laranja/limão) ou sementes crioulas de milho',
    quantity: '1 unidade',
    condition: 'Excelente',
    tags: ['pulverizador', 'ferramenta', 'costal', 'jacto'],
    createdAt: 'Há 1 dia',
    status: 'disponivel'
  },
  {
    id: 'item_seeds',
    userId: 'user_maria',
    userName: 'Maria Oliveira',
    userAvatar: '/src/assets/images/farmer_maria_avatar_1794017310176.jpg',
    userLocation: 'Chácara Sol Nascente',
    distanceKm: 4.8,
    title: 'Sementes de Feijão Crioulo & Milho Caiano',
    category: 'sementes',
    description: 'Sementes crioulas colhidas e curadas à mão, livres de transgênicos e químicas. Germinação comprovada acima de 92%.',
    imageUrl: '/src/assets/images/escambo_sementes_1794017311208.jpg',
    acceptsInReturn: 'Esterco de carneiro ou galinha curtido, ou mudas de café',
    quantity: '2 sacos de 10kg',
    condition: 'Orgânico Certificado',
    tags: ['crioulo', 'sem_agrotoxico', 'feijão', 'milho'],
    createdAt: 'Há 2 dias',
    status: 'disponivel'
  },
  {
    id: 'item_compost',
    userId: 'user_joao',
    userName: 'João Silva (Você)',
    userAvatar: '/src/assets/images/farmer_joao_avatar_1794017308636.jpg',
    userLocation: 'Sítio Boa Vista',
    distanceKm: 0,
    title: 'Composto Orgânico de Curral & Restos Vegetais',
    category: 'insumos',
    description: 'Composto maduro e penerado, rico em matéria orgânica e microrganismos eficientes. Pronto para canteiro ou covas.',
    imageUrl: '/src/assets/images/escambo_sementes_1794017311208.jpg',
    acceptsInReturn: 'Arame farpado, mourões de cerca ou lona plástica',
    quantity: '6 sacos de 30kg',
    condition: 'Orgânico Certificado',
    tags: ['compostagem', 'adubo', 'agroecologia'],
    createdAt: 'Há 3 dias',
    status: 'disponivel'
  },
  {
    id: 'item_tractor_service',
    userId: 'user_carlos',
    userName: 'Carlos Mendes',
    userAvatar: '/src/assets/images/farmer_antonio_avatar_1794017309678.jpg',
    userLocation: 'Fazenda Três Pontes',
    distanceKm: 7.1,
    title: 'Diária de Trator Pequeno c/ Arado e Grade',
    category: 'servicos',
    description: 'Disponibilizo trator com operador experiente para preparar terra em sítios até 15km de distância.',
    imageUrl: '/src/assets/images/escambo_pulverizador_1794017311348.jpg',
    acceptsInReturn: 'Troco por silagem de milho, ração animal ou serviços de poda/carpintaria',
    quantity: '1 ou 2 diárias (8h/dia)',
    condition: 'Excelente',
    tags: ['trator', 'arado', 'serviço', 'preparo_de_solo'],
    createdAt: 'Há 4 dias',
    status: 'disponivel'
  },
  {
    id: 'item_banana_mudas',
    userId: 'user_lourdes',
    userName: 'Dona Lourdes',
    userAvatar: '/src/assets/images/farmer_maria_avatar_1794017310176.jpg',
    userLocation: 'Sítio Bela Vista',
    distanceKm: 11.4,
    title: 'Mudas Clones de Banana Prata & Nanica',
    category: 'sementes',
    description: 'Mudas tipo chifrete vigorosas, retiradas de matrizes saudáveis sem mal-do-panamá.',
    imageUrl: '/src/assets/images/escambo_sementes_1794017311208.jpg',
    acceptsInReturn: 'Troco por ferramentas manuais (enxadão, cavadeira) ou abóbora seca',
    quantity: '30 mudas prontas',
    condition: 'Novo',
    tags: ['banana', 'mudas', 'fruticultura'],
    createdAt: 'Há 5 dias',
    status: 'disponivel'
  }
];

export const initialForumPosts: ForumPost[] = [
  {
    id: 'post_1',
    communityId: 'grp_geral',
    communityName: 'Geral (Nossa Região Rural)',
    authorId: 'user_maria',
    authorName: 'Maria Oliveira',
    authorAvatar: '/src/assets/images/farmer_maria_avatar_1794017310176.jpg',
    authorLocation: 'Chácara Sol Nascente',
    distanceKm: 4.8,
    badgeTag: '🌱 Agroecologia',
    content: 'Vizinhos, preparei um lote de calda de fumo com sabão de coco caseiro para afastar pulgões na couve e no tomateiro sem usar defensivo químico. Se alguém estiver precisando da receita exata ou quiser buscar uma garrafa de 2 litros aqui no sítio, só me avisar!',
    imageUrl: '/src/assets/images/escambo_sementes_1794017311208.jpg',
    createdAt: 'Há 3 horas',
    likes: 12,
    isLiked: false,
    comments: [
      {
        id: 'c_1',
        authorId: 'user_joao',
        authorName: 'João Silva',
        authorAvatar: '/src/assets/images/farmer_joao_avatar_1794017308636.jpg',
        authorLocation: 'Sítio Boa Vista',
        content: 'Maravilha, Maria! Qual a proporção de sabão você usa por litro d\'água?',
        createdAt: 'Há 2 horas',
        likes: 2
      },
      {
        id: 'c_2',
        authorId: 'user_maria',
        authorName: 'Maria Oliveira',
        authorAvatar: '/src/assets/images/farmer_maria_avatar_1794017310176.jpg',
        authorLocation: 'Chácara Sol Nascente',
        content: 'Uso 50g de fumo em corda picado em 1 litro de álcool por 24h, depois diluo 100ml dessa calda em 10 litros de água com 50g de sabão de coco neutro ralado. Não queima a folha!',
        createdAt: 'Há 1 hora',
        likes: 4
      }
    ]
  },
  {
    id: 'post_2',
    communityId: 'grp_geral',
    communityName: 'Geral (Nossa Região Rural)',
    authorId: 'user_antonio',
    authorName: 'Antônio Carlos',
    authorAvatar: '/src/assets/images/farmer_antonio_avatar_1794017309678.jpg',
    authorLocation: 'Sítio Recanto Verde',
    distanceKm: 2.3,
    badgeTag: '🚜 Ajuda Mútua',
    content: 'Atenção aos vizinhos da Estrada do Barreiro: o bueiro perto da curva da mangueira está entupindo com as folhas secas. Neste sábado pela manhã vou levar a motosserra e as pás para desobstruir antes da chuva. Quem tiver livre para somar um mutirão de 2 horinhas, teremos café quente e pão de queijo da comadre!',
    createdAt: 'Ontem',
    likes: 18,
    isLiked: true,
    comments: [
      {
        id: 'c_3',
        authorId: 'user_joao',
        authorName: 'João Silva',
        authorAvatar: '/src/assets/images/farmer_joao_avatar_1794017308636.jpg',
        authorLocation: 'Sítio Boa Vista',
        content: 'Conte comigo, Antônio! Levo duas pás de bico e a carretinha.',
        createdAt: 'Ontem',
        likes: 3
      }
    ]
  }
];

export const initialConversations: Conversation[] = [
  {
    id: 'conv_antonio',
    participantId: 'user_antonio',
    participantName: 'Antônio Carlos',
    participantAvatar: '/src/assets/images/farmer_antonio_avatar_1794017309678.jpg',
    participantLocation: 'Sítio Recanto Verde (a 2.3 km)',
    distanceKm: 2.3,
    lastMessage: 'Aceita trocar o pulverizador por 3 sacos de composto orgânico?',
    lastTimestamp: '10:42',
    unreadCount: 1,
    activeProposal: {
      id: 'prop_1',
      conversationId: 'conv_antonio',
      senderId: 'user_antonio',
      receiverId: 'user_joao',
      requestedItemId: 'item_compost',
      requestedItemTitle: 'Composto Orgânico de Curral (3 sacos)',
      requestedItemImage: '/src/assets/images/escambo_sementes_1794017311208.jpg',
      offeredItemTitle: 'Bomba de Pulverização Costal 20L',
      offeredItemDescription: 'Bomba Jacto costal revisada com bicos novos.',
      offeredItemImage: '/src/assets/images/escambo_pulverizador_1794017311348.jpg',
      status: 'pendente',
      createdAt: 'Hoje às 10:30'
    },
    messages: [
      {
        id: 'm1',
        senderId: 'user_antonio',
        text: 'Olá João! Tudo bom com você e a família no Sítio Boa Vista?',
        timestamp: '10:20'
      },
      {
        id: 'm2',
        senderId: 'user_joao',
        text: 'Bom dia compadre Antônio! Tudo em paz por aqui graças a Deus. Como estão os preparativos do cafezal?',
        timestamp: '10:25'
      },
      {
        id: 'm3',
        senderId: 'user_antonio',
        text: 'Tão a todo vapor! Vi no Escambutor que você cadastrou composto orgânico maduro. Eu tenho aquela bomba costal da Jacto parada no galpão.',
        timestamp: '10:28'
      },
      {
        id: 'm4',
        senderId: 'user_antonio',
        text: 'Enviei uma proposta formal de escambo direto aqui na conversa:',
        timestamp: '10:30',
        isProposal: true,
        proposalId: 'prop_1'
      },
      {
        id: 'm5',
        senderId: 'user_antonio',
        text: 'Aceita trocar o pulverizador por 3 sacos de composto orgânico?',
        timestamp: '10:42'
      }
    ]
  },
  {
    id: 'conv_maria',
    participantId: 'user_maria',
    participantName: 'Maria Oliveira',
    participantAvatar: '/src/assets/images/farmer_maria_avatar_1794017310176.jpg',
    participantLocation: 'Chácara Sol Nascente (a 4.8 km)',
    distanceKm: 4.8,
    lastMessage: 'Combinado João! Passo aí no sábado depois da feira.',
    lastTimestamp: 'Ontem',
    unreadCount: 0,
    activeProposal: {
      id: 'prop_2',
      conversationId: 'conv_maria',
      senderId: 'user_joao',
      receiverId: 'user_maria',
      requestedItemId: 'item_seeds',
      requestedItemTitle: 'Sementes de Feijão Crioulo',
      requestedItemImage: '/src/assets/images/escambo_sementes_1794017311208.jpg',
      offeredItemTitle: 'Mandioca Manteiga fresca (2 caixas)',
      offeredItemDescription: 'Mandioca colhida na véspera, cozimento de 15 minutos.',
      status: 'concluida',
      createdAt: '03/11',
      completedAt: '05/11'
    },
    messages: [
      {
        id: 'm10',
        senderId: 'user_joao',
        text: 'Oi Maria, vi as sementes de feijão crioulo no mural de trocas. Ainda tem daquela variedade vermelha?',
        timestamp: '03/11 14:10'
      },
      {
        id: 'm11',
        senderId: 'user_maria',
        text: 'Oi João! Tenho sim, separei 10kg perfeitos para você.',
        timestamp: '03/11 14:22'
      },
      {
        id: 'm12',
        senderId: 'user_maria',
        text: 'Combinado João! Passo aí no sábado depois da feira.',
        timestamp: 'Ontem 16:45'
      }
    ]
  }
];
