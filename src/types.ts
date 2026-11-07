/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  farmName: string;
  municipality: string;
  state: string;
  locationDetails: string;
  isLocationPrivate: boolean; // RN02/RF01: approximate privacy
  farmSizeHectares: number;
  whatProduces: string;
  sustainablePractices: string[];
  reputationAverage: number;
  totalRecommendations: number;
  badges: string[];
  joinedDate: string;
}

export interface BarterItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userLocation: string;
  distanceKm: number;
  title: string;
  category: 'ferramentas' | 'sementes' | 'insumos' | 'servicos' | 'producao';
  description: string;
  imageUrl: string;
  acceptsInReturn: string;
  quantity: string;
  condition: 'Novo' | 'Excelente' | 'Bom' | 'Usado' | 'Orgânico Certificado';
  tags: string[];
  createdAt: string;
  status: 'disponivel' | 'em_negociacao' | 'trocado';
}

export interface TradeProposal {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  requestedItemId: string;
  requestedItemTitle: string;
  requestedItemImage: string;
  offeredItemTitle: string;
  offeredItemDescription: string;
  offeredItemImage?: string;
  status: 'pendente' | 'aceita' | 'recusada' | 'concluida' | 'cancelada';
  createdAt: string;
  completedAt?: string;
}

export interface NeighborReview {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  targetUserId: string;
  rating: number; // 1 to 5
  comment: string;
  tradeSummary: string;
  date: string;
  badgesGiven: string[];
}

export interface ClimateWarning {
  id: string;
  title: string;
  severity: 'alerta' | 'perigo' | 'emergencia';
  description: string;
  targetRegion: string;
  validUntil: string;
  usefulVotes: number;
  unconfirmedVotes: number;
  userVoted?: 'useful' | 'unconfirmed';
  recommendations: string[];
  iconType: 'frost' | 'pest' | 'rain' | 'drought';
}

export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  region: string;
  cropType: string;
  memberCount: number;
  isMember: boolean;
  avatarIcon: string;
}

export interface ForumComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorLocation: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
}

export interface ForumPost {
  id: string;
  communityId: string;
  communityName: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorLocation: string;
  distanceKm: number;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  badgeTag?: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  comments: ForumComment[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isProposal?: boolean;
  proposalId?: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantLocation: string;
  distanceKm: number;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  activeProposal?: TradeProposal;
  messages: ChatMessage[];
}

export type AppTab = 'forum' | 'escambo' | 'chat' | 'perfil';
