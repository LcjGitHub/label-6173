import { Tag } from '@blueprintjs/core';
import type { SelectedGearDetail, BudgetConfig } from '../types';
import {
  formatWeight,
  calcTotalBudgetUsageWithQuantity,
  calcCategoryBudgetUsagesWithQuantity,
} from '../utils/weight';

interface BudgetDisplayProps {
  /** 已勾选的装备详情列表（包含数量） */
  selectedDetails: SelectedGearDetail[];
  /** 重量预算配置 */
  budgetConfig: BudgetConfig;
}

/**
 * 预算展示面板
 * 以进度条和标签形式展示当前打包勾选状态下总重与各分类重量占预算的比例，
 * 超限时对应进度条变为警告色，进度条宽度不封顶以体现超出幅度。
 * 顶栏状态标签在总重超限或任一分类超限时均显示超限警告。
 */
export function BudgetDisplay({ selectedDetails, budgetConfig }: BudgetDisplayProps) {
  const totalUsage = calcTotalBudgetUsageWithQuantity(selectedDetails, budgetConfig);
  const categoryUsages = calcCategoryBudgetUsagesWithQuantity(selectedDetails, budgetConfig);

  const hasCategoryOver = categoryUsages.some((c) => c.isOver);
  const isAnyOver = totalUsage.isOver || hasCategoryOver;

  const totalPercent = totalUsage.ratio * 100;
  const totalBarClass = `budget-bar${totalUsage.isOver ? ' budget-bar--over' : ''}`;

  return (
    <div className="budget-display">
      <div className="budget-display__header">
        <span className="budget-display__title">重量预算</span>
        <Tag round intent={isAnyOver ? 'danger' : 'success'}>
          {isAnyOver ? '已超限' : '正常'}
        </Tag>
      </div>

      <div className="budget-display__total">
        <div className="budget-display__total-header">
          <span className="budget-display__label">总重量</span>
          <span className="budget-display__value">
            {formatWeight(totalUsage.current)} / {formatWeight(totalUsage.budget)}
          </span>
        </div>
        <div className="budget-bar__track budget-bar__track--over">
          <div
            className={totalBarClass}
            style={{ width: `${totalPercent}%` }}
          />
        </div>
        <div className="budget-display__total-percent">
          {totalPercent.toFixed(1)}%
        </div>
      </div>

      <div className="budget-display__categories">
        <div className="budget-display__categories-title">各分类预算</div>
        {categoryUsages.map((cat) => {
          const catPercent = cat.ratio * 100;
          const catBarClass = `budget-bar budget-bar--small${cat.isOver ? ' budget-bar--over' : ''}`;
          return (
            <div key={cat.category} className="budget-category">
              <div className="budget-category__header">
                <span className="budget-category__name">
                  <Tag minimal={!cat.isOver} intent={cat.isOver ? 'danger' : 'none'}>
                    {cat.category}
                  </Tag>
                </span>
                <span className="budget-category__meta">
                  <span className="budget-category__weight">
                    {formatWeight(cat.current)} / {formatWeight(cat.budget)}
                  </span>
                  <Tag
                    round
                    minimal
                    intent={cat.isOver ? 'danger' : 'none'}
                    className="budget-category__percent"
                  >
                    {catPercent.toFixed(1)}%
                  </Tag>
                </span>
              </div>
              <div className="budget-bar__track budget-bar__track--small budget-bar__track--over">
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
