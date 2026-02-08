import { getMemories } from './memory.ts';
import { searchMemories } from './search.ts';

export function assembleContext(query: string, maxLength: number = 1000): string {
  const parts: string[] = [];
  let currentLength = 0;
  
  // 1. 用户画像
  const profiles = getMemories('user_profile', 3);
  for (const p of profiles) {
    if (currentLength + p.content.length < maxLength * 0.3) {
      parts.push(`用户偏好: ${p.content}`);
      currentLength += p.content.length;
    }
  }
  
  // 2. 相关记忆
  const relevant = searchMemories(query, 3);
  for (const r of relevant) {
    if (currentLength + r.content.length < maxLength) {
      parts.push(`相关记忆: ${r.content}`);
      currentLength += r.content.length;
    }
  }
  
  return parts.length > 0 ? `
[记忆]
${parts.join('\n')}
[/记忆]
` : '';
}
