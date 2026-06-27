/**
 * Seed: Solicitation Types
 * Usage: node scripts/seed-solicitation-types.mjs
 *
 * Populates the backend with common Brazilian urban problem categories.
 * Each entry has a description and a points value representing citizen
 * contribution weight (higher = more impactful report).
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3337';



const SOLICITATION_TYPES = [
  // Vias e pavimentação
  { description: 'Buraco na via pública', points: 30 },
  { description: 'Calçada danificada ou irregular', points: 20 },
  { description: 'Erosão ou deslizamento em via', points: 40 },
  { description: 'Faixa de pedestres apagada', points: 15 },
  { description: 'Sinalização de trânsito danificada ou ausente', points: 25 },
  { description: 'Guia rebaixada ausente ou danificada', points: 20 },

  // Limpeza urbana
  { description: 'Lixo jogado em via pública', points: 20 },
  { description: 'Descarte irregular de entulho', points: 30 },
  { description: 'Ponto de descarte clandestino de lixo', points: 35 },
  { description: 'Terreno baldio com acúmulo de lixo ou mato', points: 25 },
  { description: 'Lixeira pública danificada ou transbordando', points: 15 },

  // Iluminação pública
  { description: 'Lâmpada de poste apagada ou piscando', points: 20 },
  { description: 'Poste de iluminação danificado', points: 30 },
  { description: 'Trecho de via sem iluminação pública', points: 35 },

  // Água e esgoto
  { description: 'Vazamento de água na via pública', points: 35 },
  { description: 'Bueiro entupido ou transbordando', points: 30 },
  { description: 'Esgoto a céu aberto', points: 45 },
  { description: 'Alagamento recorrente por falta de drenagem', points: 40 },

  // Vegetação e meio ambiente
  { description: 'Árvore com risco de queda', points: 40 },
  { description: 'Galho sobre fiação elétrica', points: 35 },
  { description: 'Mato alto em área pública', points: 15 },
  { description: 'Queimada ou foco de incêndio em área verde', points: 50 },

  // Infraestrutura pública
  { description: 'Poste ou placa tombada na via', points: 35 },
  { description: 'Grade de proteção ou corrimão danificado', points: 25 },
  { description: 'Equipamento de praça ou parque danificado', points: 20 },
  { description: 'Pichação em equipamento ou bem público', points: 10 },

  // Animais
  { description: 'Animal abandonado ou em situação de risco', points: 30 },
  { description: 'Foco de infestação por animais (ratos, pombos, etc.)', points: 35 },
];

async function createSolicitationType(entry) {
  const response = await fetch(`${API_URL}/solicitation-types`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`HTTP ${response.status}: ${body}`);
  }

  const data = await response.json();
  // Unwrap envelope if present
  return data?.RES ?? data?.data ?? data;
}

async function run() {
  console.log(`Seeding ${SOLICITATION_TYPES.length} solicitation types → ${API_URL}\n`);

  let created = 0;
  let failed = 0;

  for (const entry of SOLICITATION_TYPES) {
    try {
      const result = await createSolicitationType(entry);
      console.log(`  ✓  [${String(result?.points ?? entry.points).padStart(2)}pts] ${entry.description}`);
      created++;
    } catch (error) {
      console.error(`  ✗  ${entry.description}\n     ${error.message}`);
      failed++;
    }
  }

  console.log(`\nDone: ${created} created, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

run();
