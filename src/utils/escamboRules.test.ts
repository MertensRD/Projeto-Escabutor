/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterBarterItems,
  validateBarterProposal,
  calculateNeighborTrustScore,
  calculateWarningEffectiveness,
  BarterItem,
  NeighborReview
} from './escamboRules';

const mockItems: BarterItem[] = [
  {
    id: 'item-1',
    userId: 'u1',
    userName: 'Antônio Carlos',
    userAvatar: '/assets/images/farmer_antonio_avatar_1794017309678.jpg',
    userLocation: 'Sítio Recanto Verde',
    distanceKm: 2,
    title: 'Bomba de Pulverização Costal 20L',
    category: 'ferramentas',
    description: 'Em ótimo estado de conservação. Revisada mês passado.',
    imageUrl: '/assets/images/escambo_pulverizador_1794017311348.jpg',
    acceptsInReturn: 'Adubo orgânico, mudas frutíferas ou sementes de milho',
    quantity: '1 unidade',
    condition: 'Excelente',
    tags: ['pulverizador', 'jacto', 'horta'],
    createdAt: '2026-11-05',
    status: 'disponivel'
  },
  {
    id: 'item-2',
    userId: 'u2',
    userName: 'Maria Oliveira',
    userAvatar: '/assets/images/farmer_maria_avatar_1794017310176.jpg',
    userLocation: 'Chácara Sol Nascente',
    distanceKm: 15,
    title: 'Sementes de Feijão Crioulo e Milho Caiano',
    category: 'sementes',
    description: 'Sementes crioulas selecionadas sem agrotóxicos da safra passada.',
    imageUrl: '/assets/images/escambo_sementes_1794017311208.jpg',
    acceptsInReturn: 'Mudas de café ou esterco curtido',
    quantity: '2 sacos de 10kg',
    condition: 'Orgânico Certificado',
    tags: ['crioulo', 'orgânico', 'sementes'],
    createdAt: '2026-11-04',
    status: 'disponivel'
  }
];

test('filterBarterItems filters by distance radius properly', () => {
  const within5km = filterBarterItems(mockItems, { maxDistanceKm: 5 });
  assert.equal(within5km.length, 1);
  assert.equal(within5km[0].id, 'item-1');

  const within20km = filterBarterItems(mockItems, { maxDistanceKm: 20 });
  assert.equal(within20km.length, 2);
});

test('filterBarterItems filters by category properly', () => {
  const seedsOnly = filterBarterItems(mockItems, { category: 'sementes' });
  assert.equal(seedsOnly.length, 1);
  assert.equal(seedsOnly[0].category, 'sementes');

  const toolsOnly = filterBarterItems(mockItems, { category: 'ferramentas' });
  assert.equal(toolsOnly.length, 1);
  assert.equal(toolsOnly[0].id, 'item-1');
});

test('filterBarterItems filters by search keyword', () => {
  const result = filterBarterItems(mockItems, { search: 'pulverizador' });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'item-1');

  const emptyResult = filterBarterItems(mockItems, { search: 'trator de esteira' });
  assert.equal(emptyResult.length, 0);
});

test('validateBarterProposal accepts valid rural barter', () => {
  const proposal = validateBarterProposal({
    offeredDescription: 'Ofereço 3 sacos de esterco de galinha curtido e 5 mudas de bananeira',
    requestedItemId: 'item-1'
  });
  assert.equal(proposal.valid, true);
});

test('validateBarterProposal enforces RN05 rejecting monetary cash offers', () => {
  const proposalPix = validateBarterProposal({
    offeredDescription: 'Pago R$ 150 no Pix e busco hoje à tarde',
    requestedItemId: 'item-1'
  });
  assert.equal(proposalPix.valid, false);
  assert.match(proposalPix.reason || '', /RN05/);

  const proposalMoney = validateBarterProposal({
    offeredDescription: 'Aceita 100 reais na mão?',
    requestedItemId: 'item-1'
  });
  assert.equal(proposalMoney.valid, false);
});

test('calculateNeighborTrustScore computes average and badges correctly', () => {
  const emptyScore = calculateNeighborTrustScore([]);
  assert.equal(emptyScore.badge, 'Vizinho Iniciante');

  const sampleReviews: NeighborReview[] = [
    { id: '1', authorName: 'Seu Zé', rating: 5, comment: 'Ótima troca!', date: '2026-11-01', tradeSummary: 'Milho por enxada' },
    { id: '2', authorName: 'Dona Ana', rating: 5, comment: 'Pontual e atencioso', date: '2026-11-02', tradeSummary: 'Adubo por mudas' },
    { id: '3', authorName: 'Tião', rating: 4, comment: 'Tudo certinho', date: '2026-11-03', tradeSummary: 'Serviço de roçada' },
    { id: '4', authorName: 'Beto', rating: 5, comment: 'Recomendo muito', date: '2026-11-04', tradeSummary: 'Sementes' },
  ];

  const score = calculateNeighborTrustScore(sampleReviews);
  assert.equal(score.total, 4);
  assert.equal(score.average, 4.8);
  assert.equal(score.badge, 'Vizinho de Confiança');
});

test('calculateWarningEffectiveness aggregates votes and checks confidence', () => {
  const alertStats = calculateWarningEffectiveness({ usefulVotes: 9, unconfirmedVotes: 1 });
  assert.equal(alertStats.percentage, 90);
  assert.equal(alertStats.isHighConfidence, true);
  assert.equal(alertStats.totalVotes, 10);
});
