import React, { useState, useRef, useEffect } from 'react';

interface EditableContentProps {
  value: string;
  onChange: (newValue: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  disabled?: boolean;
}

const EditableContent: React.FC<EditableContentProps> = ({
  value,
  onChange,
  className = '',
  placeholder = 'Click to edit',
  multiline = false,
  disabled = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Обновляем editValue при изменении value извне
  useEffect(() => {
    setEditValue(value);
  }, [value]);

  // Фокусируемся на поле ввода при начале редактирования
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  const handleClick = () => {
    if (!disabled) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editValue !== value) {
      onChange(editValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleBlur();
    } else if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditValue(e.target.value);
  };

  if (isEditing) {
    const InputComponent = multiline ? 'textarea' : 'input';
    return (
      <InputComponent
        ref={inputRef as any}
        value={editValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`${className} bg-transparent border border-blue-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-500`}
        placeholder={placeholder}
        disabled={disabled}
        {...(multiline ? { rows: 4 } : {})}
      />
    );
  }

  return (
    <span
      className={`${className} ${isHovered && !disabled ? 'bg-gray-100 rounded cursor-text' : ''} ${disabled ? 'cursor-default' : 'cursor-text'}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={disabled ? undefined : 'Click to edit'}
    >
      {value || placeholder}
    </span>
  );
};

export default EditableContent;
