/** 装备项 */
export interface GearItem {
  id: string;
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
