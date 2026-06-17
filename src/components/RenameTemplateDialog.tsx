import { useState, useEffect } from 'react';
import { Dialog, InputGroup, Button, Label } from '@blueprintjs/core';

interface RenameTemplateDialogProps {
  /** 弹窗是否显示 */
  isOpen: boolean;
  /** 当前模板名称，用于回填输入框 */
  currentName: string;
  /** 关闭弹窗回调 */
  onClose: () => void;
  /** 确认重命名回调，参数为新名称（已 trim） */
  onConfirm: (newName: string) => void;
}

/** 模板重命名弹窗：输入新名称并保存 */
export function RenameTemplateDialog({
  isOpen,
  currentName,
  onClose,
  onConfirm,
}: RenameTemplateDialogProps) {
  const [name, setName] = useState(currentName);

  useEffect(() => {
    if (isOpen) {
      setName(currentName);
    }
  }, [isOpen, currentName]);

  const handleConfirm = () => {
    if (!name.trim()) return;
    onConfirm(name.trim());
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      title="重命名模板"
      onClose={onClose}
      className="rename-template-dialog"
    >
      <div className="rename-template-dialog__body">
        <Label>
          模板名称
          <InputGroup
            placeholder="请输入新的模板名称..."
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') handleConfirm();
            }}
            autoFocus
          />
        </Label>
        <div className="rename-template-dialog__actions">
          <Button onClick={onClose}>取消</Button>
          <Button intent="primary" onClick={handleConfirm} disabled={!name.trim()}>
            确认
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
