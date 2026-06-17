import { useState } from 'react';
import { Button, InputGroup } from '@blueprintjs/core';
import { usePackStore } from '../store/packStore';

/** 保存模板对话框区域 */
export function SaveTemplateForm() {
  const [name, setName] = useState('');
  const saveTemplate = usePackStore((s) => s.saveTemplate);
  const selectedCount = usePackStore((s) => s.selectedItems.length);

  const handleSave = () => {
    if (!name.trim() || selectedCount === 0) return;
    saveTemplate(name);
    setName('');
  };

  return (
    <div className="save-template">
      <InputGroup
        placeholder="输入模板名称..."
        value={name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
        disabled={selectedCount === 0}
      />
      <Button
        intent="success"
        onClick={handleSave}
        disabled={!name.trim() || selectedCount === 0}
      >
        保存为模板
      </Button>
    </div>
  );
}
