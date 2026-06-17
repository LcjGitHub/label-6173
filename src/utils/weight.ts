import type { GearItem } from '../types';

/**
 * 将克数格式化为可读重量字符串
 * @param grams - 重量（克）
 */
export function formatWeight(grams: number): string {
  if (grams >= 1000) {
    return `${(grams / 1000).toFixed(2)} kg`;
  }
  return `${grams} g`;
}

/**
 * 计算装备列表总重量
 * @param items - 装备列表
 */
export function calcTotalWeight(items: GearItem[]): number {
  return items.reduce((sum, item) => sum + item.weight, 0);
}

/**
 * 按分类对装备分组
 * @param items - 装备列表
 */
export function groupByCategory(items: GearItem[]): Record<string, GearItem[]> {
  const groups: Record<string, GearItem[]> = {};
  for (const item of items) {
    if (!groups[item.category]) {
      groups[item.category] = [];
    }
    groups[item.category].push(item);
  }
  return groups;
}
