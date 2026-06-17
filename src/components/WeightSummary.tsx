import { Tag } from '@blueprintjs/core';
import type { SelectedGearDetail } from '../types';
import { formatWeight, calcTotalWeightWithQuantity, calcTotalItemCount, calcCategoryWeightSummaries } from '../utils/weight';

interface WeightSummaryProps {
  /** 已选装备详情列表（包含数量） */
  selectedDetails: SelectedGearDetail[];
  /** 总重量上限（克），0 或 undefined 表示未设置 */
  maxWeight?: number;
}

/**
 * 实时重量汇总面板
 * 展示当前已选装备的总重量、总件数，并按装备分类汇总展示各分类的已选件数、
 * 分类总重、占总重量的比例及横向进度条，帮助用户直观了解重量分布。
 * 当设置了重量上限且当前总重超过上限时，面板边框和总重量数字会变为警告色。
 */
export function WeightSummary({ selectedDetails, maxWeight }: WeightSummaryProps) {
  const total = calcTotalWeightWithQuantity(selectedDetails);
  const count = calcTotalItemCount(selectedDetails);
  const categorySummaries = calcCategoryWeightSummaries(selectedDetails);
  const isOverWeight = maxWeight !== undefined && maxWeight > 0 && total > maxWeight;

  return (
    <div className={`weight-summary${isOverWeight ? ' weight-summary--over' : ''}`}>
      <div className="weight-summary__header">
        <span className="weight-summary__title">打包汇总</span>
        <Tag round intent="primary">{count} 件</Tag>
      </div>
      <div className="weight-summary__total">
        <span className="weight-summary__label">总重量</span>
        <span className={`weight-summary__value${isOverWeight ? ' weight-summary__value--over' : ''}`}>
          {formatWeight(total)}
        </span>
      </div>
      {categorySummaries.length > 0 && (
        <div className="weight-summary__categories">
          <div className="weight-summary__categories-title">分类统计</div>
          {categorySummaries.map((cat) => {
            const percent = cat.weightRatio * 100;
            const displayWidth = Math.max(percent, 2);
            return (
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
                <div className="weight-summary__category-progress-row">
                  <div className="weight-summary__category-progress">
                    <div
                      className="weight-summary__category-progress-bar"
                      style={{ width: `${displayWidth}%` }}
                      role="progressbar"
                      aria-valuenow={Number(percent.toFixed(1))}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${cat.category}占总重量${percent.toFixed(1)}%`}
                    />
                  </div>
                  <Tag
                    round
                    minimal
                    className="weight-summary__category-percent"
                  >
                    {percent.toFixed(1)}%
                  </Tag>
                </div>
              </div>
            );
          })}
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
