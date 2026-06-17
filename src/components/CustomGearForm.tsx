import { useState } from 'react';
import {
  Button,
  InputGroup,
  HTMLSelect,
  OverlayToaster,
  Position,
  Intent,
} from '@blueprintjs/core';
import { usePackStore } from '../store/packStore';

const CATEGORIES = [
  '住宿',
  '炊具',
  '照明',
  '服装',
  '安全',
  '工具',
  '饮水',
  '食物',
  '个护',
  '电子',
  '其他',
];

const toaster = OverlayToaster.create({ position: Position.TOP });

/** 自定义装备添加表单，包含校验错误提示与成功通知 */
export function CustomGearForm() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [weight, setWeight] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const addCustomGear = usePackStore((s) => s.addCustomGear);

  const validate = (): string[] => {
    const errs: string[] = [];
    if (!name.trim()) errs.push('请输入装备名称');
    if (!category.trim()) errs.push('请选择分类');
    const weightNum = parseFloat(weight);
    if (weight === '' || weight === undefined) errs.push('请输入重量');
    else if (isNaN(weightNum) || weightNum <= 0) errs.push('重量必须为大于 0 的数字');
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate();
    if (errs.length > 0) return;
    const weightNum = parseFloat(weight);
    addCustomGear({ name, category, weight: weightNum });
    setName('');
    setWeight('');
    setSubmitted(false);
    toaster.show({ message: '自定义装备添加成功', intent: Intent.SUCCESS });
  };

  const currentErrors = submitted ? validate() : [];

  return (
    <form className="custom-gear-form" onSubmit={handleSubmit}>
      <div className="custom-gear-form__row">
        <InputGroup
          placeholder="装备名称"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
        />
        <HTMLSelect
          value={category}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </HTMLSelect>
        <InputGroup
          placeholder="重量(克)"
          value={weight}
          type="number"
          min="0"
          step="0.1"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWeight(e.target.value)}
        />
        <Button intent="primary" type="submit">
          添加
        </Button>
      </div>
      {currentErrors.length > 0 && (
        <div className="custom-gear-form__errors">
          {currentErrors.map((err, i) => (
            <div key={i} className="custom-gear-form__error">
              {err}
            </div>
          ))}
        </div>
      )}
    </form>
  );
}
