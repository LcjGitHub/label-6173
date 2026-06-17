import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GearItem,
  PackTemplate,
  CustomGearFormData,
  BudgetConfig,
  TravelRecord,
  SaveRecordFormData,
  SelectedGearEntry,
  SelectedGearDetail,
} from '../types';

interface PackState {
  /** 当前勾选的装备列表（包含数量） */
  selectedItems: SelectedGearEntry[];
  /** 已保存的模板列表 */
  templates: PackTemplate[];
  /** 自定义装备列表 */
  customGear: GearItem[];
  /** 重量预算配置 */
  budgetConfig: BudgetConfig;
  /** 出行记录列表 */
  travelRecords: TravelRecord[];
  /** 勾选/取消勾选装备 */
  toggleGear: (id: string) => void;
  /** 设置已选装备列表（用于加载模板） */
  setSelectedItems: (items: SelectedGearEntry[]) => void;
  /** 设置装备数量 */
  setQuantity: (id: string, quantity: number) => void;
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
  /** 保存出行记录 */
  saveTravelRecord: (data: SaveRecordFormData, allGear: GearItem[]) => void;
  /** 删除出行记录 */
  deleteTravelRecord: (id: string) => void;
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
      selectedItems: [],
      templates: [],
      customGear: [],
      budgetConfig: getDefaultBudgetConfig(),
      travelRecords: [],

      toggleGear: (id) => {
        const { selectedItems } = get();
        const existingIndex = selectedItems.findIndex((item) => item.id === id);
        if (existingIndex !== -1) {
          set({
            selectedItems: selectedItems.filter((_, index) => index !== existingIndex),
          });
        } else {
          set({
            selectedItems: [...selectedItems, { id, quantity: 1 }],
          });
        }
      },

      setSelectedItems: (items) => set({ selectedItems: items }),

      setQuantity: (id, quantity) => {
        const safeQuantity = Math.max(1, Math.floor(quantity) || 1);
        const { selectedItems } = get();
        const newItems = selectedItems.map((item) =>
          item.id === id ? { ...item, quantity: safeQuantity } : item,
        );
        set({ selectedItems: newItems });
      },

      clearSelection: () => set({ selectedItems: [] }),

      reorderSelected: (fromIndex, toIndex) => {
        const items = [...get().selectedItems];
        const [removed] = items.splice(fromIndex, 1);
        items.splice(toIndex, 0, removed);
        set({ selectedItems: items });
      },

      saveTemplate: (name) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        const template: PackTemplate = {
          id: `tpl-${Date.now()}`,
          name: trimmed,
          selectedItems: [...get().selectedItems],
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
          set({ selectedItems: [...template.selectedItems] });
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
          selectedItems: get().selectedItems.filter((item) => item.id !== id),
          templates: get().templates.map((t) => ({
            ...t,
            selectedItems: t.selectedItems.filter((item) => item.id !== id),
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

      saveTravelRecord: (data, allGear) => {
        const trimmedName = data.name.trim();
        if (!trimmedName || !data.tripDate) return;
        const selectedItems = get().selectedItems;
        const selectedDetails: SelectedGearDetail[] = selectedItems
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

        const totalWeight = selectedDetails.reduce((sum, d) => sum + d.totalWeight, 0);
        const itemCount = selectedDetails.reduce((sum, d) => sum + d.quantity, 0);

        const record: TravelRecord = {
          id: `rec-${Date.now()}`,
          name: trimmedName,
          tripDate: data.tripDate,
          items: selectedDetails,
          totalWeight,
          itemCount,
          createdAt: new Date().toISOString(),
        };
        set({ travelRecords: [...get().travelRecords, record] });
      },

      deleteTravelRecord: (id) => {
        set({ travelRecords: get().travelRecords.filter((r) => r.id !== id) });
      },
    }),
    {
      name: 'camping-pack-storage',
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as Record<string, unknown>;
        if (version === 0 && state.selectedIds && Array.isArray(state.selectedIds)) {
          const migratedItems = (state.selectedIds as string[]).map((id) => ({
            id,
            quantity: 1,
          }));
          state.selectedItems = migratedItems;
          delete state.selectedIds;

          if (state.templates && Array.isArray(state.templates)) {
            interface OldPackTemplate {
              selectedIds?: string[];
            }
            state.templates = (state.templates as (PackTemplate & OldPackTemplate)[]).map((tpl) => {
              if (tpl.selectedIds && Array.isArray(tpl.selectedIds)) {
                return {
                  ...tpl,
                  selectedItems: tpl.selectedIds.map((id: string) => ({ id, quantity: 1 })),
                };
              }
              return tpl;
            });
          }
        }
        return state;
      },
      version: 1,
    },
  ),
);
