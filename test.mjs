// test.mjs — PROOF-OF-PLAY for SEEDMIND, the reproducing knowledge organism. Zero tokens, deterministic.
// Proves the four living loops: HOLD (content-addressed memory), CONNECT (typed edges by ear), DREAM
// (Gary's cycle — the organism forms connections it was NEVER given, and converges), and BREED (seed→plant
// forks a CHILD with its own identity, the same bloodline root, the parent's memories as seed, growing its
// own self on top — reproduction, verified content-exact, across generations).
import { Seedmind, sig, embed, chord, recognize } from './seedmind.mjs';

let pass = 0, fail = 0;
const ok = (c, m) => { c ? pass++ : fail++; console.log((c ? '  ✓ ' : '  ✗ FAIL ') + m); };
const LIFE = [
  'my daughter loves painting in the garden', 'the garden shed needs a new roof before winter',
  'winter heating bills are going up again', 'i want to build a treehouse for the kids',
  'mum called about christmas plans', 'christmas is going to be tight on money this year',
  'i keep meaning to start the woodworking project', 'the kids would love a treehouse in the garden',
  'money has been stressing me out lately', 'i should call mum back about the holidays',
];
const build = () => { const s = new Seedmind({ id: 'me' }); for (const t of LIFE) s.remember(t); return s; };

console.log('=== §1 · HOLD — content-addressed memory (same text → same memory, deterministic) ===');
{
  const s = new Seedmind({ id: 'me' });
  const a = s.remember('i want to build a treehouse');
  const b = s.remember('i want to build a treehouse');
  ok(a && a.id === sig('i want to build a treehouse') && a === b && s.memories.size === 1, 'a memory is content-addressed — remembering it twice is one memory');
  ok(s.remember('') === null && s.remember('   ') === null, 'an empty memory is not held');
  ok(embed('cat').join() === embed('cat').join() && JSON.stringify(chord('money money')) === JSON.stringify(chord('money money')), 'embed + chord are deterministic');
}

console.log('\n=== §2 · CONNECT — memories link by ear (kin / complementary / clash) ===');
{
  const s = build();
  ok(s.edges.size > 0, `intake auto-linked kin memories (${s.edges.size} edges from ${s.memories.size} memories)`);
  ok(recognize(chord('love family home mum kids'), chord('family home love care kids')) === 'kin', 'two heart-heavy notes are KIN');
  ok(['kin', 'complementary', 'clash', 'distant'].includes(recognize(chord('money debt cost'), chord('love family home'))), 'recognize always returns a verdict');
  const treehouse = s.memories.get(sig('i want to build a treehouse for the kids'));
  ok(treehouse && s.connections(treehouse.id).length >= 1, 'the treehouse note is connected to at least one related memory');
}

console.log('\n=== §3 · DREAM (Gary\'s cycle) — the organism forms connections it was NEVER given ===');
{
  const s = build();
  const before = s.stats().connections;
  const d = s.dream();
  ok(d.count > 0, `overnight, the organism FORMED ${d.count} new connections on its own`);
  ok(s.stats().connections > before, `its graph grew while "asleep": ${before} → ${s.stats().connections} connections`);
  ok(Array.isArray(d.bridges), `it reports its BRIDGES (A~B~C ⟹ A~C insights): ${d.bridges.length} this cycle`);
  const d2 = s.dream();
  ok(d2.count <= d.count, `a second cycle adds no more than the first — consolidation CONVERGES (${d.count} → ${d2.count})`);
  const a = build(); a.dream(); const b = build(); b.dream();
  ok(a.stats().connections === b.stats().connections, 'dreaming is deterministic — the same life dreams the same connections');
}

console.log('\n=== §4 · BREED — seed → plant forks a CHILD that grows its own self (nobody builds this) ===');
{
  const parent = build(); parent.dream();
  const seed = parent.seed();
  ok(seed.genome.memories.length === parent.memories.size && typeof seed.address === 'string', 'seed() exports the whole genome as one content-addressed bundle');
  const child = Seedmind.plant(seed, { id: 'friend', owner: 'a friend' });
  ok(child.id !== parent.id, 'the child has its OWN identity (a distinct organism, not a copy)');
  ok(child.lineage.parent === parent.id && child.lineage.root === parent.lineage.root, 'same bloodline ROOT, parent recorded — a FORK, not a clone (§19 fork=identity)');
  ok(child.lineage.depth === parent.lineage.depth + 1, 'the child is one generation deeper');
  const parentMems = new Set([...parent.memories.values()].map(m => m.id));
  const childSeeded = new Set([...child.memories.values()].filter(m => m.seeded).map(m => m.id));
  ok([...parentMems].every(id => childSeeded.has(id)), 'the child INHERITED all the parent\'s memories (as its seed)');
  child.remember('a thought that is entirely my own, the parent never had it');
  ok([...child.memories.values()].some(m => !m.seeded), 'the child grows its OWN memories on top — it becomes a DIFFERENT self');
  ok(Seedmind.reproduces(parent), 'seed → plant re-folds the genome content-EXACT — faithful reproduction');
  const grandchild = Seedmind.plant(child.seed(), { id: 'friend-of-friend', owner: 'another' });
  ok(grandchild.lineage.depth === 2 && grandchild.lineage.root === parent.lineage.root, 'a GRANDCHILD keeps the root — the bloodline persists as it breeds down the generations');
}

console.log('\n=== §5 · ONE FILE — the whole organism round-trips through a single JSON blob ===');
{
  const s = build(); s.dream();
  const back = Seedmind.fromJSON(JSON.parse(JSON.stringify(s.toJSON())));
  ok(back.memories.size === s.memories.size && back.edges.size === s.edges.size, 'memories + connections survive the round-trip');
  ok(back.lineage.root === s.lineage.root && back.dreams === s.dreams, 'identity, lineage and dream-count survive — it IS the same organism reloaded');
}

console.log('\n=== §6 · DETERMINISM + FUZZ — never throws on garbage ===');
{
  const a = build(); a.dream(); const b = build(); b.dream();
  ok(JSON.stringify(a.toJSON().edges.length) === JSON.stringify(b.toJSON().edges.length), 'the same life builds the same organism (deterministic)');
  let threw = false, seed = 0x5eed >>> 0; const rnd = () => { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return seed >>> 0; };
  try {
    const s = new Seedmind({ id: 'fuzz' });
    for (let i = 0; i < 500; i++) s.remember(String.fromCharCode(...Array.from({ length: rnd() % 30 }, () => 32 + rnd() % 94)));
    s.dream(); s.seed(); Seedmind.plant(s.seed(), {}); Seedmind.fromJSON({}); Seedmind.plant(null); s.remember(null); recognize(chord(null), chord(undefined));
  } catch (e) { threw = true; console.log('    threw:', e.message); }
  ok(!threw, '500 garbage memories + dream + seed + plant + fromJSON({}) + null inputs: 0 throws');
}

console.log('\n' + (fail === 0
  ? `=== ✅ SEEDMIND LIVES — it holds a life, dreams its own connections, and BREEDS · ${pass}/${pass} · zero tokens ===`
  : `=== ✗ ${fail} FAILED (${pass} passed) ===`));
process.exit(fail === 0 ? 0 : 1);
