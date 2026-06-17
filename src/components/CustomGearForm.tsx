import { useState } from 'react';
import { Button, InputGroup, HTMLSelect } from '@blueprintjs/core';
import { usePackStore } from '../store/packStore';

const CATEGORIES = ['住宿', '炊具', '照明', '服装', '安全', '工具', '饮水', '食物', '个护', '电子', '其他'];

export function CustomGearForm() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [weight, setWeight] = useState('');
  const addCustomGear = usePackStore((s) => s.addCustomGear);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weightNum = parseFloat(weight);
    if (!name.trim() || !category.trim() || isNaN(weightNum) || weightNum <= 0) return;
    addCustomGear({ name, category, weight: weightNum });
    setName('');
    setWeight('');
  };

  const weightNum = parseFloat(weight);
  const isValid = name.trim() && category.trim() && !isNaN(weightNum) && weightNum > 0;

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
            <option key={c} value={c}>{c}</option>
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
        <Button intent="primary" type="submit" disabled={!isValid}>
          添加
        </Button>
      </div>
    </form>
  );
}
