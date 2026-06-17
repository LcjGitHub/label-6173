import { Tag } from '@blueprintjs/core';
import type { TemplateComparisonResult } from '../types';
import { formatWeight, groupDetailsByCategory } from '../utils/weight';

interface TemplateComparisonProps {
  /** 对比结果 */
  result: TemplateComparisonResult;
}

/** 模板对比展示组件 */
export function TemplateComparison({ result }: TemplateComparisonProps) {
  const { templateA, templateB, weightDiff, commonItems, onlyAItems, onlyBItems } = result;

  const groupsA = groupDetailsByCategory(templateA.items);
  const groupsB = groupDetailsByCategory(templateB.items);

  const categoriesA = Object.keys(groupsA);
  const categoriesB = Object.keys(groupsB);

  const weightDiffAbs = Math.abs(weightDiff);
  const diffIntent = weightDiff > 0 ? 'danger' : weightDiff < 0 ? 'success' : 'none';

  let weightDiffText: string;
  if (weightDiff > 0) {
    weightDiffText = `模板甲比模板乙重 ${formatWeight(weightDiffAbs)}`;
  } else if (weightDiff < 0) {
    weightDiffText = `模板甲比模板乙轻 ${formatWeight(weightDiffAbs)}`;
  } else {
    weightDiffText = '两个模板重量相同';
  }

  const renderPanelItem = (detail: typeof templateA.items[0]) => (
    <div key={detail.gear.id} className="template-comparison__item">
      <span className="template-comparison__item-name">
        {detail.gear.name}
        {detail.quantity > 1 && (
          <Tag minimal className="template-comparison__item-quantity">×{detail.quantity}</Tag>
        )}
      </span>
      <span className="template-comparison__item-weight">{formatWeight(detail.totalWeight)}</span>
    </div>
  );

  return (
    <div className="template-comparison">
      <div className="template-comparison__panels">
        <div className="template-comparison__panel">
          <div className="template-comparison__panel-header">
            <h3 className="template-comparison__panel-title">{templateA.name}</h3>
            <div className="template-comparison__panel-meta">
              <Tag round>{templateA.itemCount} 件</Tag>
              <Tag round intent="primary">{formatWeight(templateA.totalWeight)}</Tag>
            </div>
          </div>
          <div className="template-comparison__panel-content">
            {categoriesA.map((category) => (
              <div key={category} className="template-comparison__category">
                <h4 className="template-comparison__category-title">{category}</h4>
                {groupsA[category].map(renderPanelItem)}
              </div>
            ))}
          </div>
        </div>

        <div className="template-comparison__panel">
          <div className="template-comparison__panel-header">
            <h3 className="template-comparison__panel-title">{templateB.name}</h3>
            <div className="template-comparison__panel-meta">
              <Tag round>{templateB.itemCount} 件</Tag>
              <Tag round intent="primary">{formatWeight(templateB.totalWeight)}</Tag>
            </div>
          </div>
          <div className="template-comparison__panel-content">
            {categoriesB.map((category) => (
              <div key={category} className="template-comparison__category">
                <h4 className="template-comparison__category-title">{category}</h4>
                {groupsB[category].map(renderPanelItem)}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="template-comparison__summary">
        <h3 className="template-comparison__summary-title">对比汇总</h3>
        
        <div className="template-comparison__summary-row">
          <div className="template-comparison__summary-item">
            <span className="template-comparison__summary-label">重量差值</span>
            <Tag round large intent={diffIntent}>
              {weightDiffText}
            </Tag>
          </div>
        </div>

        <div className="template-comparison__summary-section">
          <h4 className="template-comparison__summary-subtitle">
            <Tag intent="primary">共有装备 ({commonItems.length} 件)</Tag>
          </h4>
          <div className="template-comparison__tags">
            {commonItems.length > 0 ? (
              commonItems.map((item) => (
                <Tag key={item.gear.id} minimal intent="primary">
                  {item.gear.name}
                  {item.quantity > 1 && ` ×${item.quantity}`}
                </Tag>
              ))
            ) : (
              <span className="template-comparison__empty">无共有装备</span>
            )}
          </div>
        </div>

        <div className="template-comparison__summary-section">
          <h4 className="template-comparison__summary-subtitle">
            <Tag intent="success">仅模板甲独有 ({onlyAItems.length} 件)</Tag>
          </h4>
          <div className="template-comparison__tags">
            {onlyAItems.length > 0 ? (
              onlyAItems.map((item) => (
                <Tag key={item.gear.id} minimal intent="success">
                  {item.gear.name}
                  {item.quantity > 1 && ` ×${item.quantity}`}
                </Tag>
              ))
            ) : (
              <span className="template-comparison__empty">无独有装备</span>
            )}
          </div>
        </div>

        <div className="template-comparison__summary-section">
          <h4 className="template-comparison__summary-subtitle">
            <Tag intent="warning">仅模板乙独有 ({onlyBItems.length} 件)</Tag>
          </h4>
          <div className="template-comparison__tags">
            {onlyBItems.length > 0 ? (
              onlyBItems.map((item) => (
                <Tag key={item.gear.id} minimal intent="warning">
                  {item.gear.name}
                  {item.quantity > 1 && ` ×${item.quantity}`}
                </Tag>
              ))
            ) : (
              <span className="template-comparison__empty">无独有装备</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
