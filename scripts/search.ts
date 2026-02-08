import { getMemories } from './memory.ts';

// 简化的关键词搜索（无需向量）
export function searchMemories(query: string, limit: number = 5): Array<{content: string, score: number}> {
  const memories = getMemories(undefined, 50);
  const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  
  if (queryWords.length === 0) return [];
  
  const scored = memories.map(m => {
    const contentWords = m.content.toLowerCase().split(/\s+/);
    let matches = 0;
    for (const qw of queryWords) {
      if (contentWords.some(cw => cw.includes(qw))) matches++;
    }
    return { content: m.content, score: matches / queryWords.length };
  });
  
  return scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score).slice(0, limit);
}
