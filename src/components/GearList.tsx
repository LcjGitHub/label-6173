import { Checkbox } from '@blueprintjs/core';
import type { GearItem } from '../types';
import { formatWeight } from '../utils/weight';

interface GearListProps {
  /** 装备列表 */
  items: GearItem[];
  /** 已勾选的 ID 集合 */
  selectedIds: Set<string>;
  /** 勾选切换回调 */
  onToggle: (id: string) => void;
}

/** 装备库勾选列表 */
export function GearList({ items, selectedIds, onToggle }: GearListProps) {
  const categories = [...new Set(items.map((i) => i.category))];

  return (
    <div className="gear-list">
      {categories.map((category) => (
        <div key={category} className="gear-list__category">
          <h3 className="gear-list__category-title">{category}</h3>
          {items
            .filter((item) => item.category === category)
            .map((item) => (
              <div key={item.id} className="gear-list__item">
                <Checkbox
                  checked={selectedIds.has(item.id)}
                  label={item.name}
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
