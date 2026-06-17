import type {
  GearItem,
  BudgetConfig,
  BudgetUsage,
  CategoryBudgetUsage,
  PackTemplate,
  TemplateComparisonResult,
  SelectedGearEntry,
  SelectedGearDetail,
  CategoryWeightSummary,
} from '../types';

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
 * 将已选装备条目转换为详情（包含装备信息和折算重量）
 * @param entries - 已选装备条目列表
 * @param allGear - 所有可用装备
 */
export function getSelectedDetails(
  entries: SelectedGearEntry[],
  allGear: GearItem[],
): SelectedGearDetail[] {
  return entries
    .map((entry) => {
      const gear = allGear.find((g) => g.id === entry.id);
      if (!gear) return null;
      return {
        gear,
        quantity: entry.quantity,
        totalWeight: gear.weight * entry.quantity,
      };
    })
    .filter((d): d is SelectedGearDetail => d !== null);
}

/**
 * 计算已选装备的总重量（考虑数量）
 * @param details - 已选装备详情列表
 */
export function calcTotalWeightWithQuantity(details: SelectedGearDetail[]): number {
  return details.reduce((sum, d) => sum + d.totalWeight, 0);
}

/**
 * 计算已选装备的总件数（按数量累加）
 * @param details - 已选装备详情列表
 */
export function calcTotalItemCount(details: SelectedGearDetail[]): number {
  return details.reduce((sum, d) => sum + d.quantity, 0);
}

/**
 * 计算装备列表总重量（不带数量，用于兼容旧代码）
 * @param items - 装备列表
 */
export function calcTotalWeight(items: GearItem[]): number {
  return items.reduce((sum, item) => sum + item.weight, 0);
}

/**
 * 按分类对已选装备详情分组
 * @param details - 已选装备详情列表
 */
export function groupDetailsByCategory(
  details: SelectedGearDetail[],
): Record<string, SelectedGearDetail[]> {
  const groups: Record<string, SelectedGearDetail[]> = {};
  for (const detail of details) {
    if (!groups[detail.gear.category]) {
      groups[detail.gear.category] = [];
    }
    groups[detail.gear.category].push(detail);
  }
  return groups;
}

/**
 * 计算各分类的重量汇总（考虑数量）
 * @param details - 已选装备详情列表
 */
export function calcCategoryWeightSummaries(
  details: SelectedGearDetail[],
): CategoryWeightSummary[] {
  const groups = groupDetailsByCategory(details);
  const totalWeight = calcTotalWeightWithQuantity(details);

  return Object.entries(groups).map(([category, categoryDetails]) => {
    const categoryTotalWeight = calcTotalWeightWithQuantity(categoryDetails);
    const categoryItemCount = calcTotalItemCount(categoryDetails);
    return {
      category,
      itemCount: categoryItemCount,
      totalWeight: categoryTotalWeight,
      weightRatio: totalWeight > 0 ? categoryTotalWeight / totalWeight : 0,
    };
  }).sort((a, b) => b.totalWeight - a.totalWeight);
}

/**
 * 按分类对装备分组（不带数量，用于兼容旧代码）
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
 * 计算总重量预算使用情况（考虑数量）
 * @param details - 已选装备详情列表
 * @param config - 预算配置
 */
export function calcTotalBudgetUsageWithQuantity(
  details: SelectedGearDetail[],
  config: BudgetConfig,
): BudgetUsage {
  const total = calcTotalWeightWithQuantity(details);
  return calcBudgetUsage(total, config.totalMaxWeight);
}

/**
 * 计算总重量预算使用情况（不带数量，用于兼容旧代码）
 * @param items - 已选装备列表
 * @param config - 预算配置
 */
export function calcTotalBudgetUsage(items: GearItem[], config: BudgetConfig): BudgetUsage {
  const total = calcTotalWeight(items);
  return calcBudgetUsage(total, config.totalMaxWeight);
}

/**
 * 计算各分类的预算使用情况（考虑数量）
 * @param details - 已选装备详情列表
 * @param config - 预算配置
 */
export function calcCategoryBudgetUsagesWithQuantity(
  details: SelectedGearDetail[],
  config: BudgetConfig,
): CategoryBudgetUsage[] {
  const groups = groupDetailsByCategory(details);
  return config.categories.map((cat) => {
    const categoryDetails = groups[cat.category] || [];
    const categoryWeight = calcTotalWeightWithQuantity(categoryDetails);
    return {
      category: cat.category,
      ...calcBudgetUsage(categoryWeight, cat.maxWeight),
    };
  });
}

/**
 * 计算各分类的预算使用情况（不带数量，用于兼容旧代码）
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
 * 根据模板获取装备详情列表（包含数量）
 * @param template - 打包模板
 * @param allGear - 所有可用装备（包含自定义装备）
 */
export function getTemplateDetails(
  template: PackTemplate,
  allGear: GearItem[],
): SelectedGearDetail[] {
  return getSelectedDetails(template.selectedItems, allGear);
}

/**
 * 根据模板 ID 获取装备详情列表（不带数量，用于兼容旧代码）
 * @param template - 打包模板
 * @param allGear - 所有可用装备（包含自定义装备）
 */
export function getTemplateItems(template: PackTemplate, allGear: GearItem[]): GearItem[] {
  return template.selectedItems
    .map((entry) => allGear.find((g) => g.id === entry.id))
    .filter((g): g is GearItem => g !== undefined);
}

/**
 * 对比两个模板，返回详细对比结果（考虑数量）
 * @param templateA - 模板 A
 * @param templateB - 模板 B
 * @param allGear - 所有可用装备（包含自定义装备）
 */
export function compareTemplates(
  templateA: PackTemplate,
  templateB: PackTemplate,
  allGear: GearItem[],
): TemplateComparisonResult {
  const detailsA = getTemplateDetails(templateA, allGear);
  const detailsB = getTemplateDetails(templateB, allGear);

  const totalWeightA = calcTotalWeightWithQuantity(detailsA);
  const totalWeightB = calcTotalWeightWithQuantity(detailsB);

  const itemCountA = calcTotalItemCount(detailsA);
  const itemCountB = calcTotalItemCount(detailsB);

  const idsA = new Set(detailsA.map((d) => d.gear.id));
  const idsB = new Set(detailsB.map((d) => d.gear.id));

  const commonItems = detailsA.filter((d) => idsB.has(d.gear.id));
  const onlyAItems = detailsA.filter((d) => !idsB.has(d.gear.id));
  const onlyBItems = detailsB.filter((d) => !idsA.has(d.gear.id));

  return {
    templateA: {
      id: templateA.id,
      name: templateA.name,
      items: detailsA,
      totalWeight: totalWeightA,
      itemCount: itemCountA,
    },
    templateB: {
      id: templateB.id,
      name: templateB.name,
      items: detailsB,
      totalWeight: totalWeightB,
      itemCount: itemCountB,
    },
    weightDiff: totalWeightA - totalWeightB,
    commonItems,
    onlyAItems,
    onlyBItems,
  };
}
