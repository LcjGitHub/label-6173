import { Tag } from '@blueprintjs/core';
import type { SelectedGearDetail } from '../types';
import { formatWeight, calcTotalWeightWithQuantity, calcTotalItemCount, calcCategoryWeightSummaries } from '../utils/weight';

interface WeightSummaryProps {
  /** 已选装备详情列表（包含数量） */
  selectedDetails: SelectedGearDetail[];
}

/** 实时重量汇总面板 */
export function WeightSummary({ selectedDetails }: WeightSummaryProps) {
  const total = calcTotalWeightWithQuantity(selectedDetails);
  const count = calcTotalItemCount(selectedDetails);
  const categorySummaries = calcCategoryWeightSummaries(selectedDetails);

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
      {categorySummaries.length > 0 && (
        <div className="weight-summary__categories">
          <div className="weight-summary__categories-title">分类统计</div>
          {categorySummaries.map((cat) => (
            <div key={cat.category} className="weight-summary__category">
              <div className="weight-summary__category-header">
                <span className="weight-summary__category-name">{cat.category}</span>
                <div className="weight-summary__category-tags">
                  <Tag minimal className="weight-summary__category-count">
                    {cat.itemCount} 件
                  </Tag>
                  <Tag minimal className="weight-summary__category-weight">
                    {formatWeight(cat.totalWeight)}
                  </Tag>
                </div>
              </div>
              <div className="weight-summary__category-progress">
                <div
                  className="weight-summary__category-progress-bar"
                  style={{ width: `${cat.weightRatio * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
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
