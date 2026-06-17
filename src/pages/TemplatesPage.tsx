import { useMemo } from 'react';
import { Button, Tag } from '@blueprintjs/core';
import gearData from '../mock/gear.json';
import type { GearItem } from '../types';
import { usePackStore } from '../store/packStore';
import { formatWeight } from '../utils/weight';

const allGear = gearData as GearItem[];

/** 模板管理页面：查看、加载、删除模板 */
export function TemplatesPage() {
  const templates = usePackStore((s) => s.templates);
  const loadTemplate = usePackStore((s) => s.loadTemplate);
  const deleteTemplate = usePackStore((s) => s.deleteTemplate);

  const templateDetails = useMemo(
    () =>
      templates.map((tpl) => {
        const items = tpl.selectedIds
          .map((id) => allGear.find((g) => g.id === id))
          .filter((g): g is GearItem => g !== undefined);
        const totalWeight = items.reduce((sum, g) => sum + g.weight, 0);
        return { ...tpl, items, totalWeight };
      }),
    [templates],
  );

  if (templates.length === 0) {
    return (
      <div className="templates-page">
        <h2>模板管理</h2>
        <p className="templates-page__empty">
          暂无保存的模板。前往「打包」页面勾选装备后保存模板。
        </p>
      </div>
    );
  }

  return (
    <div className="templates-page">
      <h2>模板管理</h2>
      <div className="templates-page__list">
        {templateDetails.map((tpl) => (
          <div key={tpl.id} className="template-card">
            <div className="template-card__header">
              <h3 className="template-card__name">{tpl.name}</h3>
              <div className="template-card__meta">
                <Tag round>{tpl.items.length} 件</Tag>
                <Tag round intent="primary">{formatWeight(tpl.totalWeight)}</Tag>
              </div>
            </div>
            <p className="template-card__date">
              创建于 {new Date(tpl.createdAt).toLocaleString('zh-CN')}
            </p>
            <div className="template-card__items">
              {tpl.items.map((item) => (
                <Tag key={item.id} minimal>{item.name}</Tag>
              ))}
            </div>
            <div className="template-card__actions">
              <Button intent="primary" small onClick={() => loadTemplate(tpl.id)}>
                加载到打包
              </Button>
              <Button intent="danger" small onClick={() => deleteTemplate(tpl.id)}>
                删除
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
