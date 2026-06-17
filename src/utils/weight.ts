import type { GearItem, BudgetConfig, BudgetUsage, CategoryBudgetUsage, PackTemplate, TemplateComparisonResult } from '../types';

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

/**
 * 根据模板 ID 获取装备详情列表
 * @param template - 打包模板
 * @param allGear - 所有可用装备（包含自定义装备）
 */
export function getTemplateItems(template: PackTemplate, allGear: GearItem[]): GearItem[] {
  return template.selectedIds
    .map((id) => allGear.find((g) => g.id === id))
    .filter((g): g is GearItem => g !== undefined);
}

/**
 * 对比两个模板，返回详细对比结果
 * @param templateA - 模板 A
 * @param templateB - 模板 B
 * @param allGear - 所有可用装备（包含自定义装备）
 */
export function compareTemplates(
  templateA: PackTemplate,
  templateB: PackTemplate,
  allGear: GearItem[],
): TemplateComparisonResult {
  const itemsA = getTemplateItems(templateA, allGear);
  const itemsB = getTemplateItems(templateB, allGear);

  const totalWeightA = calcTotalWeight(itemsA);
  const totalWeightB = calcTotalWeight(itemsB);

  const idsA = new Set(itemsA.map((i) => i.id));
  const idsB = new Set(itemsB.map((i) => i.id));

  const commonItems = itemsA.filter((item) => idsB.has(item.id));
  const onlyAItems = itemsA.filter((item) => !idsB.has(item.id));
  const onlyBItems = itemsB.filter((item) => !idsA.has(item.id));

  return {
    templateA: {
      id: templateA.id,
      name: templateA.name,
      items: itemsA,
      totalWeight: totalWeightA,
      itemCount: itemsA.length,
    },
    templateB: {
      id: templateB.id,
      name: templateB.name,
      items: itemsB,
      totalWeight: totalWeightB,
      itemCount: itemsB.length,
    },
    weightDiff: totalWeightA - totalWeightB,
    commonItems,
    onlyAItems,
    onlyBItems,
  };
}
