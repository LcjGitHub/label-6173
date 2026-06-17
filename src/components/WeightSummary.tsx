import { Tag } from '@blueprintjs/core';
import type { GearItem } from '../types';
import { formatWeight } from '../utils/weight';

interface WeightSummaryProps {
  /** 已选装备列表 */
  selectedItems: GearItem[];
}

/** 实时重量汇总面板 */
export function WeightSummary({ selectedItems }: WeightSummaryProps) {
  const total = selectedItems.reduce((sum, item) => sum + item.weight, 0);
  const count = selectedItems.length;

  return (
    <div className="weight-summary">
      <div className="weight-summary__header">
        <span className="weight-summary__title">打包汇总</span>
        <Tag round intent="primary">{count} 件</Tag>
      </div>
      <div className="weight-summary__total">
        <span className="weight-summary__label">总重量</span>
        <span className="weight-summary__value">{formatWeight(total)}</span>
      </div>
      {selectedItems.length > 0 && (
        <div className="weight-summary__breakdown">
          {selectedItems.map((item) => (
            <div key={item.id} className="weight-summary__item">
              <span>{item.name}</span>
              <Tag minimal>{formatWeight(item.weight)}</Tag>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
