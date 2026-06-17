import { useState, useEffect } from 'react';
import { Dialog, InputGroup, Button } from '@blueprintjs/core';

interface RenameTemplateDialogProps {
  isOpen: boolean;
  currentName: string;
  onClose: () => void;
  onConfirm: (newName: string) => void;
}

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
        <InputGroup
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') handleConfirm();
          }}
          autoFocus
        />
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
