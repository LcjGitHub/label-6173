import { useMemo } from 'react';
import { Tag } from '@blueprintjs/core';
import type { SelectedGearDetail } from '../types';
import {
  formatWeight,
  calcTotalWeight,
  calcTotalItemCount,
  groupDetailsByCategory,
} from '../utils/weight';

/**
 * 打印预览排版组件属性
 */
interface PrintPreviewLayoutProps {
  /** 已选装备详情列表（按拖拽顺序排列，包含数量） */
  details: SelectedGearDetail[];
}

/**
 * 分类汇总信息
 */
interface CategorySummary {
  /** 分类名称 */
  category: string;
  /** 分类下的装备列表（保持原始拖拽顺序） */
  details: SelectedGearDetail[];
  /** 分类总重量（考虑数量） */
  totalWeight: number;
  /** 分类总件数（考虑数量） */
  itemCount: number;
  /** 分类在全局中的起始序号 */
  startIndex: number;
}

/**
 * 打印预览排版组件
 * @description 以适合打印的简洁排版展示装备清单，按分类分组，
 *              保持已选装备的拖拽顺序，使用全局连续序号。
 */
export function PrintPreviewLayout({ details }: PrintPreviewLayoutProps) {
  /** 按分类分组的装备数据，保持原始拖拽顺序 */
  const { categories, totalWeight, totalItemCount } = useMemo(() => {
    const groups = groupDetailsByCategory(details);

    let globalIndex = 0;
    const categorySummaries: CategorySummary[] = [];
    for (const [category, categoryDetails] of Object.entries(groups)) {
      const categoryWeight = calcTotalWeight(categoryDetails);
      const categoryCount = calcTotalItemCount(categoryDetails);
      categorySummaries.push({
        category,
        details: categoryDetails,
        totalWeight: categoryWeight,
        itemCount: categoryCount,
        startIndex: globalIndex,
      });
      globalIndex += categoryDetails.length;
    }

    return {
      categories: categorySummaries,
      totalWeight: calcTotalWeight(details),
      totalItemCount: calcTotalItemCount(details),
    };
  }, [details]);

  /** 空状态 */
  if (details.length === 0) {
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
      {/* 页面标题 */}
      <div className="print-preview__header">
        <h1 className="print-preview__title">装备清单</h1>
        <p className="print-preview__subtitle">打印于 {new Date().toLocaleDateString('zh-CN')}</p>
      </div>

      {/* 汇总区域 */}
      <div className="print-preview__summary">
        <div className="print-preview__summary-item">
          <span className="print-preview__summary-label">装备总数</span>
          <span className="print-preview__summary-value">{totalItemCount} 件</span>
        </div>
        <div className="print-preview__summary-item">
          <span className="print-preview__summary-label">分类数</span>
          <span className="print-preview__summary-value">{categories.length} 类</span>
        </div>
        <div className="print-preview__summary-item">
          <span className="print-preview__summary-label">总重量</span>
          <span className="print-preview__summary-value print-preview__summary-value--highlight">
            {formatWeight(totalWeight)}
          </span>
        </div>
      </div>

      {/* 按分类分组的装备表格 */}
      {categories.map((cat) => (
        <div key={cat.category} className="print-preview__category">
          <div className="print-preview__category-header">
            <h2 className="print-preview__category-title">{cat.category}</h2>
            <span className="print-preview__category-meta">
              {cat.itemCount} 件 · {formatWeight(cat.totalWeight)}
            </span>
          </div>

          <table className="print-preview__table">
            <thead>
              <tr>
                <th className="print-preview__table-col--index">序号</th>
                <th className="print-preview__table-col--name">名称</th>
                <th className="print-preview__table-col--quantity">数量</th>
                <th className="print-preview__table-col--weight">单件重量</th>
                <th className="print-preview__table-col--weight">折算重量</th>
              </tr>
            </thead>
            <tbody>
              {cat.details.map((detail, idx) => (
                <tr key={detail.gear.id}>
                  <td className="print-preview__index">{cat.startIndex + idx + 1}</td>
                  <td>
                    <span className="print-preview__item-name">{detail.gear.name}</span>
                    {detail.gear.isCustom && (
                      <Tag className="print-preview__custom-tag" minimal intent="warning">
                        自定义
                      </Tag>
                    )}
                  </td>
                  <td className="print-preview__quantity">{detail.quantity}</td>
                  <td className="print-preview__weight">{formatWeight(detail.gear.weight)}</td>
                  <td className="print-preview__weight">{formatWeight(detail.totalWeight)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* 页脚汇总 */}
      <div className="print-preview__footer">
        共 {totalItemCount} 件装备 · 总重量 {formatWeight(totalWeight)}
      </div>
    </div>
  );
}
