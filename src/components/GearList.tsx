import { useMemo } from 'react';
import { Checkbox, Tag } from '@blueprintjs/core';
import type { GearItem } from '../types';
import { formatWeight } from '../utils/weight';

interface GearListProps {
  /** 装备列表 */
  items: GearItem[];
  /** 已勾选的 ID 集合 */
  selectedIds: Set<string>;
  /** 勾选切换回调 */
  onToggle: (id: string) => void;
  /** 搜索关键词（按名称模糊匹配） */
  searchKeyword?: string;
  /** 分类筛选值，空字符串表示全部 */
  categoryFilter?: string;
}

/** 装备库勾选列表 */
export function GearList({ items, selectedIds, onToggle, searchKeyword = '', categoryFilter = '' }: GearListProps) {
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch = searchKeyword.trim() === '' || item.name.toLowerCase().includes(searchKeyword.trim().toLowerCase());
      const matchCategory = categoryFilter === '' || item.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [items, searchKeyword, categoryFilter]);

  const categories = [...new Set(filteredItems.map((i) => i.category))];

  if (filteredItems.length === 0) {
    return (
      <div className="gear-list">
        <div className="gear-list__empty">暂无装备</div>
      </div>
    );
  }

  return (
    <div className="gear-list">
      {categories.map((category) => (
        <div key={category} className="gear-list__category">
          <h3 className="gear-list__category-title">{category}</h3>
          {filteredItems
            .filter((item) => item.category === category)
            .map((item) => (
              <div key={item.id} className="gear-list__item">
                <Checkbox
                  checked={selectedIds.has(item.id)}
                  labelElement={
                    <span className="gear-list__label">
                      {item.name}
                      {item.isCustom && <Tag className="gear-list__custom-tag" minimal intent="warning">自定义</Tag>}
                    </span>
                  }
                  onChange={() => onToggle(item.id)}
                />
                <span className="gear-list__weight">{formatWeight(item.weight)}</span>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
