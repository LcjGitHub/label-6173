import { Tag } from '@blueprintjs/core';
import type { GearItem, BudgetConfig } from '../types';
import {
  formatWeight,
  calcTotalBudgetUsage,
  calcCategoryBudgetUsages,
} from '../utils/weight';

interface BudgetDisplayProps {
  selectedItems: GearItem[];
  budgetConfig: BudgetConfig;
}

export function BudgetDisplay({ selectedItems, budgetConfig }: BudgetDisplayProps) {
  const totalUsage = calcTotalBudgetUsage(selectedItems, budgetConfig);
  const categoryUsages = calcCategoryBudgetUsages(selectedItems, budgetConfig);

  const percent = Math.min(totalUsage.ratio * 100, 100);
  const totalBarClass = `budget-bar${totalUsage.isOver ? ' budget-bar--over' : ''}`;

  return (
    <div className="budget-display">
      <div className="budget-display__header">
        <span className="budget-display__title">重量预算</span>
        <Tag round intent={totalUsage.isOver ? 'danger' : 'success'}>
          {totalUsage.isOver ? '已超限' : '正常'}
        </Tag>
      </div>

      <div className="budget-display__total">
        <div className="budget-display__total-header">
          <span className="budget-display__label">总重量</span>
          <span className="budget-display__value">
            {formatWeight(totalUsage.current)} / {formatWeight(totalUsage.budget)}
          </span>
        </div>
        <div className="budget-bar__track">
          <div
            className={totalBarClass}
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="budget-display__total-percent">
          {(totalUsage.ratio * 100).toFixed(1)}%
        </div>
      </div>

      <div className="budget-display__categories">
        <div className="budget-display__categories-title">各分类预算</div>
        {categoryUsages.map((cat) => {
          const catPercent = Math.min(cat.ratio * 100, 100);
          const catBarClass = `budget-bar budget-bar--small${cat.isOver ? ' budget-bar--over' : ''}`;
          return (
            <div key={cat.category} className="budget-category">
              <div className="budget-category__header">
                <span className="budget-category__name">
                  <Tag minimal={!cat.isOver} intent={cat.isOver ? 'danger' : 'none'}>
                    {cat.category}
                  </Tag>
                </span>
                <span className="budget-category__weight">
                  {formatWeight(cat.current)} / {formatWeight(cat.budget)}
                </span>
              </div>
              <div className="budget-bar__track budget-bar__track--small">
                <div
                  className={catBarClass}
                  style={{ width: `${catPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
