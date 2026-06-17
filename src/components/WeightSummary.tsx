import { Tag } from '@blueprintjs/core';
import type { SelectedGearDetail } from '../types';
import { formatWeight, calcTotalWeightWithQuantity, calcTotalItemCount } from '../utils/weight';

interface WeightSummaryProps {
  /** 已选装备详情列表（包含数量） */
  selectedDetails: SelectedGearDetail[];
}

/** 实时重量汇总面板 */
export function WeightSummary({ selectedDetails }: WeightSummaryProps) {
  const total = calcTotalWeightWithQuantity(selectedDetails);
  const count = calcTotalItemCount(selectedDetails);

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
      {selectedDetails.length > 0 && (
        <div className="weight-summary__breakdown">
          {selectedDetails.map((detail) => (
            <div key={detail.gear.id} className="weight-summary__item">
              <span className="weight-summary__item-name">
                {detail.gear.name}
                <Tag minimal className="weight-summary__item-quantity">
                  ×{detail.quantity}
                </Tag>
              </span>
              <Tag minimal className="weight-summary__item-weight">
                {formatWeight(detail.totalWeight)}
              </Tag>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
