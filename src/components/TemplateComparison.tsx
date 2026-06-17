import { Tag } from '@blueprintjs/core';
import type { TemplateComparisonResult } from '../types';
import { formatWeight, groupByCategory } from '../utils/weight';

interface TemplateComparisonProps {
  /** 对比结果 */
  result: TemplateComparisonResult;
}

/** 模板对比展示组件 */
export function TemplateComparison({ result }: TemplateComparisonProps) {
  const { templateA, templateB, weightDiff, commonItems, onlyAItems, onlyBItems } = result;

  const groupsA = groupByCategory(templateA.items);
  const groupsB = groupByCategory(templateB.items);

  const categoriesA = Object.keys(groupsA);
  const categoriesB = Object.keys(groupsB);

  const weightDiffAbs = Math.abs(weightDiff);
  const weightDiffSign = weightDiff > 0 ? '+' : weightDiff < 0 ? '-' : '';
  const diffIntent = weightDiff > 0 ? 'danger' : weightDiff < 0 ? 'success' : 'none';

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
                {groupsA[category].map((item) => (
                  <div key={item.id} className="template-comparison__item">
                    <span className="template-comparison__item-name">{item.name}</span>
                    <span className="template-comparison__item-weight">{formatWeight(item.weight)}</span>
                  </div>
                ))}
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
                {groupsB[category].map((item) => (
                  <div key={item.id} className="template-comparison__item">
                    <span className="template-comparison__item-name">{item.name}</span>
                    <span className="template-comparison__item-weight">{formatWeight(item.weight)}</span>
                  </div>
                ))}
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
              {weightDiffSign}{formatWeight(weightDiffAbs)}
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
                <Tag key={item.id} minimal intent="primary">
                  {item.name}
                </Tag>
              ))
            ) : (
              <span className="template-comparison__empty">无共有装备</span>
            )}
          </div>
        </div>

        <div className="template-comparison__summary-section">
          <h4 className="template-comparison__summary-subtitle">
            <Tag intent="success">仅 {templateA.name} 独有 ({onlyAItems.length} 件)</Tag>
          </h4>
          <div className="template-comparison__tags">
            {onlyAItems.length > 0 ? (
              onlyAItems.map((item) => (
                <Tag key={item.id} minimal intent="success">
                  {item.name}
                </Tag>
              ))
            ) : (
              <span className="template-comparison__empty">无独有装备</span>
            )}
          </div>
        </div>

        <div className="template-comparison__summary-section">
          <h4 className="template-comparison__summary-subtitle">
            <Tag intent="warning">仅 {templateB.name} 独有 ({onlyBItems.length} 件)</Tag>
          </h4>
          <div className="template-comparison__tags">
            {onlyBItems.length > 0 ? (
              onlyBItems.map((item) => (
                <Tag key={item.id} minimal intent="warning">
                  {item.name}
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
