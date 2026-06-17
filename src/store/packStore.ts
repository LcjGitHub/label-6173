import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PackTemplate } from '../types';

interface PackState {
  /** 当前勾选的装备 ID 列表 */
  selectedIds: string[];
  /** 已保存的模板列表 */
  templates: PackTemplate[];
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
}

/** 打包状态 store，localStorage 持久化 */
export const usePackStore = create<PackState>()(
  persist(
    (set, get) => ({
      selectedIds: [],
      templates: [],

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
    }),
    {
      name: 'camping-pack-storage',
    },
  ),
);
