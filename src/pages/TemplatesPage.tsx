import { useMemo, useState } from 'react';
import { Button, Tag, OverlayToaster, Position, Intent } from '@blueprintjs/core';
import { usePackStore } from '../store/packStore';
import { formatWeight, getTemplateDetails, calcTotalWeight, calcTotalItemCount } from '../utils/weight';
import { useAllGear } from '../hooks/useAllGear';
import { RenameTemplateDialog } from '../components/RenameTemplateDialog';

const toaster = OverlayToaster.create({ position: Position.TOP });

/** 模板管理页面：查看、加载、重命名、复制、删除模板 */
export function TemplatesPage() {
  const templates = usePackStore((s) => s.templates);
  const loadTemplate = usePackStore((s) => s.loadTemplate);
  const deleteTemplate = usePackStore((s) => s.deleteTemplate);
  const renameTemplate = usePackStore((s) => s.renameTemplate);
  const copyTemplate = usePackStore((s) => s.copyTemplate);
  const allGear = useAllGear();

  const [renameTarget, setRenameTarget] = useState<{ id: string; name: string } | null>(null);

  const templateDetails = useMemo(
    () =>
      templates.map((tpl) => {
        const details = getTemplateDetails(tpl, allGear);
        const totalWeight = calcTotalWeight(details);
        const itemCount = calcTotalItemCount(details);
        return { ...tpl, details, totalWeight, itemCount };
      }),
    [templates, allGear],
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
                <Tag round>{tpl.itemCount} 件</Tag>
                <Tag round intent="primary">{formatWeight(tpl.totalWeight)}</Tag>
              </div>
            </div>
            <p className="template-card__date">
              创建于 {new Date(tpl.createdAt).toLocaleString('zh-CN')}
            </p>
            <div className="template-card__items">
              {tpl.details.map((detail) => (
                <Tag key={detail.gear.id} minimal>
                  {detail.gear.name} ×{detail.quantity}
                </Tag>
              ))}
            </div>
            <div className="template-card__actions">
              <Button intent="primary" small onClick={() => loadTemplate(tpl.id)}>
                加载到打包
              </Button>
              <Button small onClick={() => setRenameTarget({ id: tpl.id, name: tpl.name })}>
                重命名
              </Button>
              <Button
                small
                onClick={() => {
                  copyTemplate(tpl.id);
                  toaster.show({ message: '模板复制成功', intent: Intent.SUCCESS });
                }}
              >
                复制
              </Button>
              <Button intent="danger" small onClick={() => deleteTemplate(tpl.id)}>
                删除
              </Button>
            </div>
          </div>
        ))}
      </div>
      <RenameTemplateDialog
        isOpen={renameTarget !== null}
        currentName={renameTarget?.name ?? ''}
        onClose={() => setRenameTarget(null)}
        onConfirm={(newName) => {
          if (renameTarget) renameTemplate(renameTarget.id, newName);
        }}
      />
    </div>
  );
}
