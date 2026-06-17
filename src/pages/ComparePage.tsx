import { useMemo, useState } from 'react';
import { HTMLSelect } from '@blueprintjs/core';
import gearData from '../mock/gear.json';
import type { GearItem, TemplateComparisonResult } from '../types';
import { usePackStore } from '../store/packStore';
import { compareTemplates } from '../utils/weight';
import { TemplateComparison } from '../components/TemplateComparison';

const mockGear = gearData as GearItem[];

/** 模板对比页面 */
export function ComparePage() {
  const templates = usePackStore((s) => s.templates);
  const customGear = usePackStore((s) => s.customGear);

  const [templateAId, setTemplateAId] = useState<string>('');
  const [templateBId, setTemplateBId] = useState<string>('');

  const allGear = useMemo(() => [...mockGear, ...customGear], [customGear]);

  const isSameTemplate = templateAId && templateBId && templateAId === templateBId;

  const comparisonResult = useMemo<TemplateComparisonResult | null>(() => {
    if (!templateAId || !templateBId) return null;
    if (templateAId === templateBId) return null;

    const templateA = templates.find((t) => t.id === templateAId);
    const templateB = templates.find((t) => t.id === templateBId);

    if (!templateA || !templateB) return null;

    return compareTemplates(templateA, templateB, allGear);
  }, [templateAId, templateBId, templates, allGear]);

  if (templates.length < 2) {
    return (
      <div className="compare-page">
        <h2>模板对比</h2>
        <p className="compare-page__empty">
          至少需要保存 2 个模板才能进行对比。前往「打包」页面勾选装备后保存模板。
        </p>
      </div>
    );
  }

  return (
    <div className="compare-page">
      <h2>模板对比</h2>

      <div className="compare-page__selectors">
        <div className="compare-page__selector">
          <label className="compare-page__label">选择模板 A</label>
          <HTMLSelect
            fill
            value={templateAId}
            onChange={(e) => setTemplateAId(e.target.value)}
          >
            <option value="">请选择模板...</option>
            {templates.map((tpl) => (
              <option key={tpl.id} value={tpl.id}>
                {tpl.name}
              </option>
            ))}
          </HTMLSelect>
        </div>

        <div className="compare-page__vs">对比</div>

        <div className="compare-page__selector">
          <label className="compare-page__label">选择模板 B</label>
          <HTMLSelect
            fill
            value={templateBId}
            onChange={(e) => setTemplateBId(e.target.value)}
          >
            <option value="">请选择模板...</option>
            {templates.map((tpl) => (
              <option key={tpl.id} value={tpl.id}>
                {tpl.name}
              </option>
            ))}
          </HTMLSelect>
        </div>
      </div>

      {isSameTemplate && (
        <p className="compare-page__warning">
          请选择两个不同的模板进行对比
        </p>
      )}

      {comparisonResult && <TemplateComparison result={comparisonResult} />}

      {!isSameTemplate && !comparisonResult && (
        <p className="compare-page__hint">
          请在上方选择两个模板进行对比
        </p>
      )}
    </div>
  );
}
