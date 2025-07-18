import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FormattingToolbar = ({ 
  onFormat, 
  activeFormats = [], 
  onInsert,
  isPreviewMode,
  onTogglePreview 
}) => {
  const formatButtons = [
    { id: 'bold', icon: 'Bold', label: 'Bold', shortcut: 'Ctrl+B' },
    { id: 'italic', icon: 'Italic', label: 'Italic', shortcut: 'Ctrl+I' },
    { id: 'underline', icon: 'Underline', label: 'Underline', shortcut: 'Ctrl+U' },
    { id: 'strikethrough', icon: 'Strikethrough', label: 'Strikethrough' },
  ];

  const insertButtons = [
    { id: 'heading', icon: 'Heading', label: 'Heading' },
    { id: 'list', icon: 'List', label: 'Bullet List' },
    { id: 'listOrdered', icon: 'ListOrdered', label: 'Numbered List' },
    { id: 'code', icon: 'Code', label: 'Code Block' },
    { id: 'quote', icon: 'Quote', label: 'Quote' },
    { id: 'link', icon: 'Link', label: 'Link' },
  ];

  const isActive = (formatId) => activeFormats.includes(formatId);

  return (
    <div className="border-t border-border bg-card">
      {/* Desktop Toolbar */}
      <div className="hidden md:flex items-center justify-between p-3">
        <div className="flex items-center space-x-1">
          {/* Format Buttons */}
          <div className="flex items-center space-x-1 pr-3 border-r border-border">
            {formatButtons.map((button) => (
              <Button
                key={button.id}
                variant={isActive(button.id) ? "default" : "ghost"}
                size="sm"
                onClick={() => onFormat(button.id)}
                title={`${button.label} (${button.shortcut || ''})`}
                className="h-8 w-8 p-0"
              >
                <Icon name={button.icon} size={16} />
              </Button>
            ))}
          </div>

          {/* Insert Buttons */}
          <div className="flex items-center space-x-1">
            {insertButtons.map((button) => (
              <Button
                key={button.id}
                variant="ghost"
                size="sm"
                onClick={() => onInsert(button.id)}
                title={button.label}
                className="h-8 w-8 p-0"
              >
                <Icon name={button.icon} size={16} />
              </Button>
            ))}
          </div>
        </div>

        {/* Preview Toggle */}
        <Button
          variant={isPreviewMode ? "default" : "outline"}
          size="sm"
          onClick={onTogglePreview}
          iconName="Eye"
          iconPosition="left"
        >
          {isPreviewMode ? 'Edit' : 'Preview'}
        </Button>
      </div>

      {/* Mobile Toolbar */}
      <div className="md:hidden">
        {/* Primary Actions */}
        <div className="flex items-center justify-between p-3 border-b border-border">
          <div className="flex items-center space-x-1">
            {formatButtons.slice(0, 3).map((button) => (
              <Button
                key={button.id}
                variant={isActive(button.id) ? "default" : "ghost"}
                size="sm"
                onClick={() => onFormat(button.id)}
                className="h-9 w-9 p-0"
              >
                <Icon name={button.icon} size={16} />
              </Button>
            ))}
          </div>

          <Button
            variant={isPreviewMode ? "default" : "outline"}
            size="sm"
            onClick={onTogglePreview}
            iconName="Eye"
            iconPosition="left"
          >
            {isPreviewMode ? 'Edit' : 'Preview'}
          </Button>
        </div>

        {/* Secondary Actions */}
        <div className="flex items-center justify-center space-x-1 p-2 overflow-x-auto">
          {insertButtons.map((button) => (
            <Button
              key={button.id}
              variant="ghost"
              size="sm"
              onClick={() => onInsert(button.id)}
              className="h-8 min-w-8 p-0 shrink-0"
            >
              <Icon name={button.icon} size={14} />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormattingToolbar;