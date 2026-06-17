import { useMemo, useState, useEffect } from 'react';
import { Button, InputGroup, FormGroup } from '@blueprintjs/core';
import { usePackStore } from '../store/packStore';
import { getSelectedDetails } from '../utils/weight';
import { useAllGear } from '../hooks/useAllGear';
import { BudgetDisplay } from '../components/BudgetDisplay';

/**
 * 重量预算管理页面
 * 左侧为预算配置区（总重上限 + 各分类上限），右侧为实时预算展示面板（sticky定位），
 * 预算配置与当前勾选装备状态联动实时更新。支持清空输入框时默认回显0，
 * 避免清空后无法更新的问题。
 */
export function BudgetPage() {
  const selectedItems = usePackStore((s) => s.selectedItems);
  const budgetConfig = usePackStore((s) => s.budgetConfig);
  const setTotalMaxWeight = usePackStore((s) => s.setTotalMaxWeight);
  const setCategoryMaxWeight = usePackStore((s) => s.setCategoryMaxWeight);
  const resetBudgetConfig = usePackStore((s) => s.resetBudgetConfig);
  const allGear = useAllGear();

  const selectedDetails = useMemo(
    () => getSelectedDetails(selectedItems, allGear),
    [selectedItems, allGear],
  );

  const [totalInput, setTotalInput] = useState<string>(budgetConfig.totalMaxWeight.toString());
  const [categoryInputs, setCategoryInputs] = useState<Record<string, string>>(() =>
    Object.fromEntries(budgetConfig.categories.map((c) => [c.category, c.maxWeight.toString()])),
  );

  useEffect(() => {
    setTotalInput(budgetConfig.totalMaxWeight.toString());
  }, [budgetConfig.totalMaxWeight]);

  useEffect(() => {
    setCategoryInputs(
      Object.fromEntries(budgetConfig.categories.map((c) => [c.category, c.maxWeight.toString()])),
    );
  }, [budgetConfig.categories]);

  const handleTotalChange = (value: string) => {
    setTotalInput(value);
    const trimmed = value.trim();
    if (trimmed === '') {
      setTotalMaxWeight(0);
      return;
    }
    const num = parseInt(trimmed, 10);
    if (!isNaN(num)) {
      setTotalMaxWeight(num);
    }
  };

  const handleCategoryChange = (category: string, value: string) => {
    setCategoryInputs((prev) => ({ ...prev, [category]: value }));
    const trimmed = value.trim();
    if (trimmed === '') {
      setCategoryMaxWeight(category, 0);
      return;
    }
    const num = parseInt(trimmed, 10);
    if (!isNaN(num)) {
      setCategoryMaxWeight(category, num);
    }
  };

  const handleReset = () => {
    resetBudgetConfig();
  };

  return (
    <div className="budget-page">
      <div className="budget-page__left">
        <div className="budget-page__section-header">
          <h2>预算配置</h2>
          <Button small onClick={handleReset} intent="warning">
            重置默认
          </Button>
        </div>

        <FormGroup label="背包总重量上限（克）" labelFor="total-budget">
          <InputGroup
            id="total-budget"
            type="number"
            min={0}
            value={totalInput}
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
                  value={categoryInputs[cat.category] ?? '0'}
                  onChange={(e) => handleCategoryChange(cat.category, e.target.value)}
                  placeholder="请输入上限"
                />
              </FormGroup>
            ))}
          </div>
        </div>
      </div>

      <div className="budget-page__right">
        <div className="budget-page__sticky">
          <BudgetDisplay selectedDetails={selectedDetails} budgetConfig={budgetConfig} />
        </div>
      </div>
    </div>
  );
}
