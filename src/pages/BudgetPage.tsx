import { useMemo } from 'react';
import { Button, InputGroup, FormGroup } from '@blueprintjs/core';
import gearData from '../mock/gear.json';
import type { GearItem } from '../types';
import { usePackStore } from '../store/packStore';
import { BudgetDisplay } from '../components/BudgetDisplay';

const mockGear = gearData as GearItem[];

export function BudgetPage() {
  const selectedIds = usePackStore((s) => s.selectedIds);
  const customGear = usePackStore((s) => s.customGear);
  const budgetConfig = usePackStore((s) => s.budgetConfig);
  const setTotalMaxWeight = usePackStore((s) => s.setTotalMaxWeight);
  const setCategoryMaxWeight = usePackStore((s) => s.setCategoryMaxWeight);
  const resetBudgetConfig = usePackStore((s) => s.resetBudgetConfig);

  const allGear = useMemo(() => [...mockGear, ...customGear], [customGear]);

  const selectedItems = useMemo(
    () =>
      selectedIds
        .map((id) => allGear.find((g) => g.id === id))
        .filter((g): g is GearItem => g !== undefined),
    [selectedIds, allGear],
  );

  const handleTotalChange = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      setTotalMaxWeight(num);
    }
  };

  const handleCategoryChange = (category: string, value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      setCategoryMaxWeight(category, num);
    }
  };

  return (
    <div className="budget-page">
      <div className="budget-page__left">
        <div className="budget-page__section-header">
          <h2>预算配置</h2>
          <Button small onClick={resetBudgetConfig} intent="warning">
            重置默认
          </Button>
        </div>

        <FormGroup label="背包总重量上限（克）" labelFor="total-budget">
          <InputGroup
            id="total-budget"
            type="number"
            min={0}
            value={budgetConfig.totalMaxWeight.toString()}
            onChange={(e) => handleTotalChange(e.target.value)}
            placeholder="请输入总重量上限"
          />
        </FormGroup>

        <div className="budget-page__section">
          <h3>各分类重量上限（克）</h3>
          <div className="budget-page__category-list">
            {budgetConfig.categories.map((cat) => (
              <FormGroup
                key={cat.category}
                label={cat.category}
                labelFor={`cat-budget-${cat.category}`}
                className="budget-page__category-form"
              >
                <InputGroup
                  id={`cat-budget-${cat.category}`}
                  type="number"
                  min={0}
                  value={cat.maxWeight.toString()}
                  onChange={(e) => handleCategoryChange(cat.category, e.target.value)}
                  placeholder="请输入上限"
                />
              </FormGroup>
            ))}
          </div>
        </div>
      </div>

      <div className="budget-page__right">
        <BudgetDisplay selectedItems={selectedItems} budgetConfig={budgetConfig} />
      </div>
    </div>
  );
}
