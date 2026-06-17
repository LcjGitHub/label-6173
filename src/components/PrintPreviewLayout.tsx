import { useMemo } from 'react';
import type { GearItem } from '../types';
import { formatWeight, groupByCategory, calcTotalWeight } from '../utils/weight';

interface PrintPreviewLayoutProps {
  items: GearItem[];
}

export function PrintPreviewLayout({ items }: PrintPreviewLayoutProps) {
  const groupedItems = useMemo(() => groupByCategory(items), [items]);
  const totalWeight = useMemo(() => calcTotalWeight(items), [items]);
  const categoryOrder = Object.keys(groupedItems);

  if (items.length === 0) {
    return (
      <div className="print-preview__content">
        <div className="print-preview__header">
          <h1 className="print-preview__title">装备清单</h1>
          <p className="print-preview__subtitle">打印预览</p>
        </div>
        <p className="print-preview__empty">尚未选择任何装备</p>
      </div>
    );
  }

  return (
    <div className="print-preview__content">
      <div className="print-preview__header">
        <h1 className="print-preview__title">装备清单</h1>
        <p className="print-preview__subtitle">打印于 {new Date().toLocaleDateString('zh-CN')}</p>
      </div>

      <div className="print-preview__summary">
        <div className="print-preview__summary-item">
          <span className="print-preview__summary-label">装备总数</span>
          <span className="print-preview__summary-value">{items.length} 件</span>
        </div>
        <div className="print-preview__summary-item">
          <span className="print-preview__summary-label">分类数</span>
          <span className="print-preview__summary-value">{categoryOrder.length} 类</span>
        </div>
        <div className="print-preview__summary-item">
          <span className="print-preview__summary-label">总重量</span>
          <span className="print-preview__summary-value print-preview__summary-value--highlight">
            {formatWeight(totalWeight)}
          </span>
        </div>
      </div>

      {categoryOrder.map((category) => {
        const categoryItems = groupedItems[category];
        const categoryWeight = calcTotalWeight(categoryItems);

        return (
          <div key={category} className="print-preview__category">
            <div className="print-preview__category-header">
              <h2 className="print-preview__category-title">{category}</h2>
              <span className="print-preview__category-meta">
                {categoryItems.length} 件 · {formatWeight(categoryWeight)}
              </span>
            </div>

            <table className="print-preview__table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>序号</th>
                  <th>名称</th>
                  <th>分类</th>
                  <th style={{ width: '100px' }}>单件重量</th>
                </tr>
              </thead>
              <tbody>
                {categoryItems.map((item, index) => (
                  <tr key={item.id}>
                    <td className="print-preview__index">{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{formatWeight(item.weight)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}

      <div className="print-preview__footer">
        共 {items.length} 件装备 · 总重量 {formatWeight(totalWeight)}
      </div>
    </div>
  );
}
