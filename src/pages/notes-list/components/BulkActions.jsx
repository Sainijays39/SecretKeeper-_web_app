import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActions = ({ selectedNotes, onDeleteSelected, onExportSelected, onCategoryChange, onExitSelection }) => {
  const categories = [
    'Personal', 'Work', 'Ideas', 'Passwords', 'Finance', 'Health'
  ];

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="CheckSquare" size={20} className="text-primary" />
          <span className="font-medium text-foreground">
            {selectedNotes.length} note{selectedNotes.length > 1 ? 's' : ''} selected
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onExitSelection}
        >
          <Icon name="X" size={16} className="mr-1" />
          Cancel
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Delete Action */}
        <Button
          variant="destructive"
          size="sm"
          onClick={onDeleteSelected}
        >
          <Icon name="Trash2" size={16} className="mr-2" />
          Delete Selected
        </Button>

        {/* Export Action */}
        <Button
          variant="outline"
          size="sm"
          onClick={onExportSelected}
        >
          <Icon name="Download" size={16} className="mr-2" />
          Export
        </Button>

        {/* Category Change */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Move to:</span>
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              size="sm"
              onClick={() => onCategoryChange(category)}
              className="text-xs"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BulkActions;