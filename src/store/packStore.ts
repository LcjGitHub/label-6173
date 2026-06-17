import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GearItem, PackTemplate, CustomGearFormData, BudgetConfig } from '../types';

interface PackState {
  /** 当前勾选的装备 ID 列表 */
  selectedIds: string[];
  /** 已保存的模板列表 */
  templates: PackTemplate[];
  /** 自定义装备列表 */
  customGear: GearItem[];
  /** 重量预算配置 */
  budgetConfig: BudgetConfig;
  /** 勾选/取消勾选装备 */
  toggleGear: (id: string) => void;
  /** 设置勾选列表（用于加载模板） */
  setSelectedIds: (ids: string[]) => void;
  /** 清空勾选 */
  clearSelection: () => void;
  /** 更新勾选顺序（拖拽排序） */
  reorderSelected: (fromIndex: number, toIndex: number) => void;
  /** 保存当前勾选为模板 */
  saveTemplate: (name: string) => void;
  /** 删除模板 */
  deleteTemplate: (id: string) => void;
  /** 加载模板到当前勾选 */
  loadTemplate: (id: string) => void;
  /** 添加自定义装备 */
  addCustomGear: (data: CustomGearFormData) => void;
  /** 更新自定义装备 */
  updateCustomGear: (id: string, data: CustomGearFormData) => void;
  /** 删除自定义装备 */
  deleteCustomGear: (id: string) => void;
  /** 设置总重量预算上限 */
  setTotalMaxWeight: (weight: number) => void;
  /** 设置分类重量预算上限 */
  setCategoryMaxWeight: (category: string, weight: number) => void;
  /** 重置预算配置为默认值 */
  resetBudgetConfig: () => void;
}

const DEFAULT_CATEGORIES = [
  '住宿', '炊具', '照明', '服装', '安全', '工具', '饮水', '食物', '个护', '电子',
];

const getDefaultBudgetConfig = (): BudgetConfig => ({
  totalMaxWeight: 10000,
  categories: DEFAULT_CATEGORIES.map((cat) => ({ category: cat, maxWeight: 1000 })),
});

/** 打包状态 store，localStorage 持久化 */
export const usePackStore = create<PackState>()(
  persist(
    (set, get) => ({
      selectedIds: [],
      templates: [],
      customGear: [],
      budgetConfig: getDefaultBudgetConfig(),

      toggleGear: (id) => {
        const { selectedIds } = get();
        if (selectedIds.includes(id)) {
          set({ selectedIds: selectedIds.filter((i) => i !== id) });
        } else {
          set({ selectedIds: [...selectedIds, id] });
        }
      },

      setSelectedIds: (ids) => set({ selectedIds: ids }),

      clearSelection: () => set({ selectedIds: [] }),

      reorderSelected: (fromIndex, toIndex) => {
        const ids = [...get().selectedIds];
        const [removed] = ids.splice(fromIndex, 1);
        ids.splice(toIndex, 0, removed);
        set({ selectedIds: ids });
      },

      saveTemplate: (name) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        const template: PackTemplate = {
          id: `tpl-${Date.now()}`,
          name: trimmed,
          selectedIds: [...get().selectedIds],
          createdAt: new Date().toISOString(),
        };
        set({ templates: [...get().templates, template] });
      },

      deleteTemplate: (id) => {
        set({ templates: get().templates.filter((t) => t.id !== id) });
      },

      loadTemplate: (id) => {
        const template = get().templates.find((t) => t.id === id);
        if (template) {
          set({ selectedIds: [...template.selectedIds] });
        }
      },

      addCustomGear: (data) => {
        const item: GearItem = {
          id: `custom-${Date.now()}`,
          name: data.name.trim(),
          category: data.category.trim(),
          weight: data.weight,
          isCustom: true,
        };
        set({ customGear: [...get().customGear, item] });
      },

      updateCustomGear: (id, data) => {
        set({
          customGear: get().customGear.map((g) =>
            g.id === id
              ? { ...g, name: data.name.trim(), category: data.category.trim(), weight: data.weight }
              : g,
          ),
        });
      },

      deleteCustomGear: (id) => {
        set({
          customGear: get().customGear.filter((g) => g.id !== id),
          selectedIds: get().selectedIds.filter((sid) => sid !== id),
          templates: get().templates.map((t) => ({
            ...t,
            selectedIds: t.selectedIds.filter((sid) => sid !== id),
          })),
        });
      },

      setTotalMaxWeight: (weight) => {
        const safeWeight = Math.max(0, weight);
        set({
          budgetConfig: {
            ...get().budgetConfig,
            totalMaxWeight: safeWeight,
          },
        });
      },

      setCategoryMaxWeight: (category, weight) => {
        const safeWeight = Math.max(0, weight);
        const current = get().budgetConfig.categories;
        const existing = current.find((c) => c.category === category);
        let newCategories;
        if (existing) {
          newCategories = current.map((c) =>
            c.category === category ? { ...c, maxWeight: safeWeight } : c,
          );
        } else {
          newCategories = [...current, { category, maxWeight: safeWeight }];
        }
        set({
          budgetConfig: {
            ...get().budgetConfig,
            categories: newCategories,
          },
        });
      },

      resetBudgetConfig: () => {
        set({ budgetConfig: getDefaultBudgetConfig() });
      },
    }),
    {
      name: 'camping-pack-storage',
    },
  ),
);
