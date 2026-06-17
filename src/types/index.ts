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

/** 模板对比结果 */
export interface TemplateComparisonResult {
  /** 模板 A 详情 */
  templateA: {
    id: string;
    name: string;
    items: GearItem[];
    totalWeight: number;
    itemCount: number;
  };
  /** 模板 B 详情 */
  templateB: {
    id: string;
    name: string;
    items: GearItem[];
    totalWeight: number;
    itemCount: number;
  };
  /** 重量差值（A - B） */
  weightDiff: number;
  /** 两模板共有装备 */
  commonItems: GearItem[];
  /** 仅模板 A 独有装备 */
  onlyAItems: GearItem[];
  /** 仅模板 B 独有装备 */
  onlyBItems: GearItem[];
}

/** 出行记录快照 */
export interface TravelRecord {
  /** 记录 ID */
  id: string;
  /** 出行名称 */
  name: string;
  /** 出行日期 */
  tripDate: string;
  /** 装备清单快照（完整对象，而非仅 ID） */
  items: GearItem[];
  /** 总重量（克） */
  totalWeight: number;
  /** 装备件数 */
  itemCount: number;
  /** 记录创建时间 */
  createdAt: string;
}

/** 保存出行记录表单数据 */
export interface SaveRecordFormData {
  name: string;
  tripDate: string;
}
