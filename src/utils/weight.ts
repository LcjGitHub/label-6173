import type { GearItem, BudgetConfig, BudgetUsage, CategoryBudgetUsage } from '../types';

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

/**
 * 计算单个预算的使用情况
 * @param current - 当前重量
 * @param budget - 预算上限
 */
export function calcBudgetUsage(current: number, budget: number): BudgetUsage {
  const ratio = budget > 0 ? current / budget : current > 0 ? 1 : 0;
  return {
    current,
    budget,
    ratio: Math.max(0, ratio),
    isOver: current > budget && budget > 0,
  };
}

/**
 * 计算总重量预算使用情况
 * @param items - 已选装备列表
 * @param config - 预算配置
 */
export function calcTotalBudgetUsage(items: GearItem[], config: BudgetConfig): BudgetUsage {
  const total = calcTotalWeight(items);
  return calcBudgetUsage(total, config.totalMaxWeight);
}

/**
 * 计算各分类的预算使用情况
 * @param items - 已选装备列表
 * @param config - 预算配置
 */
export function calcCategoryBudgetUsages(
  items: GearItem[],
  config: BudgetConfig,
): CategoryBudgetUsage[] {
  const groups = groupByCategory(items);
  return config.categories.map((cat) => {
    const categoryItems = groups[cat.category] || [];
    const categoryWeight = calcTotalWeight(categoryItems);
    return {
      category: cat.category,
      ...calcBudgetUsage(categoryWeight, cat.maxWeight),
    };
  });
}
