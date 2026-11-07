/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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

export interface BarterFilterOptions {
  search?: string;
  maxDistanceKm?: number;
  category?: string;
}

export interface NeighborReview {
  id: string;
  authorName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  tradeSummary: string;
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
  recommendations: string[];
}

/**
 * Filter barter items by query, distance radius, and category (RF05)
 */
export function filterBarterItems(items: BarterItem[], options: BarterFilterOptions): BarterItem[] {
  const { search = '', maxDistanceKm, category } = options;
  const cleanSearch = search.trim().toLowerCase();

  return items.filter((item) => {
    // Distance filter
    if (typeof maxDistanceKm === 'number' && item.distanceKm > maxDistanceKm) {
      return false;
    }

    // Category filter
    if (category && category !== 'todos' && item.category !== category) {
      return false;
    }

    // Search query filter
    if (cleanSearch) {
      const matchTitle = item.title.toLowerCase().includes(cleanSearch);
      const matchDesc = item.description.toLowerCase().includes(cleanSearch);
      const matchUser = item.userName.toLowerCase().includes(cleanSearch);
      const matchReturn = item.acceptsInReturn.toLowerCase().includes(cleanSearch);
      const matchTag = item.tags.some((t) => t.toLowerCase().includes(cleanSearch));
      if (!matchTitle && !matchDesc && !matchUser && !matchReturn && !matchTag) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Validates a barter proposal to enforce RN05 (strictly barter, no monetary payments)
 * and prevent invalid trades.
 */
export function validateBarterProposal(params: {
  offeredDescription: string;
  offeredItemId?: string;
  requestedItemId: string;
}): { valid: boolean; reason?: string } {
  const { offeredDescription, requestedItemId } = params;

  if (!requestedItemId) {
    return { valid: false, reason: 'Selecione o item de interesse para o escambo.' };
  }

  if (!offeredDescription || offeredDescription.trim().length < 5) {
    return { valid: false, reason: 'Descreva detalhadamente o que você está oferecendo em troca.' };
  }

  // RN05: Check for monetary / cash sales solicitation
  const monetaryPattern = /\b(r\$|reais|pix|dep[oó]sito|cart[aã]o|venda|vendo|compro|ted|boleto)\b/i;
  if (monetaryPattern.test(offeredDescription)) {
    return {
      valid: false,
      reason: 'Regra RN05: O Escambutor é exclusivamente para trocas de insumos, equipamentos e serviços rurais. Transações financeiras ou pagamentos em dinheiro são estritamente proibidos.',
    };
  }

  return { valid: true };
}

/**
 * Calculates average rating and neighbor confidence badge (RF06)
 */
export function calculateNeighborTrustScore(reviews: NeighborReview[]): {
  average: number;
  total: number;
  badge: 'Vizinho Iniciante' | 'Produtor Recomendado' | 'Vizinho de Confiança' | 'Pilar da Comunidade';
} {
  if (!reviews || reviews.length === 0) {
    return {
      average: 5.0,
      total: 0,
      badge: 'Vizinho Iniciante',
    };
  }

  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  const average = Number((sum / reviews.length).toFixed(1));

  let badge: 'Vizinho Iniciante' | 'Produtor Recomendado' | 'Vizinho de Confiança' | 'Pilar da Comunidade' = 'Vizinho Iniciante';
  if (reviews.length >= 10 && average >= 4.8) {
    badge = 'Pilar da Comunidade';
  } else if (reviews.length >= 4 && average >= 4.5) {
    badge = 'Vizinho de Confiança';
  } else if (reviews.length >= 1) {
    badge = 'Produtor Recomendado';
  }

  return {
    average,
    total: reviews.length,
    badge,
  };
}

/**
 * Aggregates climate and disaster warning community votes (RF08 / RN04)
 */
export function calculateWarningEffectiveness(warning: { usefulVotes: number; unconfirmedVotes: number }): {
  percentage: number;
  isHighConfidence: boolean;
  totalVotes: number;
} {
  const total = warning.usefulVotes + warning.unconfirmedVotes;
  if (total === 0) {
    return { percentage: 100, isHighConfidence: false, totalVotes: 0 };
  }
  const percentage = Math.round((warning.usefulVotes / total) * 100);
  const isHighConfidence = total >= 5 && percentage >= 75;
  return { percentage, isHighConfidence, totalVotes: total };
}
