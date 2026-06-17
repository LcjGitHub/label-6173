/** 装备项 */
export interface GearItem {
  id: string;
  name: string;
  category: string;
  weight: number;
  isCustom?: boolean;
}

/** 自定义装备表单数据 */
export interface CustomGearFormData {
  name: string;
  category: string;
  weight: number;
}

/** 打包清单模板 */
export interface PackTemplate {
  id: string;
  name: string;
  selectedIds: string[];
  createdAt: string;
}

/** 分类预算配置 */
export interface CategoryBudget {
  /** 分类名称 */
  category: string;
  /** 分类重量上限（克） */
  maxWeight: number;
}

/** 重量预算配置 */
export interface BudgetConfig {
  /** 背包总重量上限（克） */
  totalMaxWeight: number;
  /** 各分类预算配置 */
  categories: CategoryBudget[];
}

/** 预算使用情况 */
export interface BudgetUsage {
  /** 当前重量（克） */
  current: number;
  /** 预算上限（克） */
  budget: number;
  /** 使用比例（0-1） */
  ratio: number;
  /** 是否超限 */
  isOver: boolean;
}

/** 分类预算使用情况 */
export interface CategoryBudgetUsage extends BudgetUsage {
  /** 分类名称 */
  category: string;
}
