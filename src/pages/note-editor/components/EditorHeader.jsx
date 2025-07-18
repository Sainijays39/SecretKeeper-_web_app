import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EditorHeader = ({ 
  noteTitle, 
  onTitleChange, 
  saveStatus, 
  lastSaved, 
  onBack, 
  onSave,
  hasUnsavedChanges 
}) => {
  const getSaveStatusDisplay = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <div className="flex items-center space-x-2 text-warning">
            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs">Saving...</span>
          </div>
        );
      case 'saved':
        return (
          <div className="flex items-center space-x-2 text-success">
            <Icon name="Check" size={14} />
            <span className="text-xs">Saved {lastSaved}</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center space-x-2 text-error">
            <Icon name="AlertCircle" size={14} />
            <span className="text-xs">Save failed</span>
          </div>
        );
      default:
        return hasUnsavedChanges ? (
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Icon name="Circle" size={14} />
            <span className="text-xs">Unsaved changes</span>
          </div>
        ) : null;
    }
  };

  return (
    <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left Section */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="shrink-0"
          >
            <Icon name="ArrowLeft" size={20} />
          </Button>
          
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={noteTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Untitled Note"
              className="w-full bg-transparent text-lg font-semibold text-foreground placeholder-muted-foreground border-none outline-none focus:ring-0 p-0"
              maxLength={100}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {getSaveStatusDisplay()}
          
          <Button
            variant="default"
            size="sm"
            onClick={onSave}
            disabled={saveStatus === 'saving'}
            iconName="Save"
            iconPosition="left"
            className="hidden sm:flex"
          >
            Save
          </Button>
          
          <Button
            variant="default"
            size="icon"
            onClick={onSave}
            disabled={saveStatus === 'saving'}
            className="sm:hidden"
          >
            <Icon name="Save" size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditorHeader;