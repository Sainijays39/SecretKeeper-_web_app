import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const CategorySelector = ({ 
  selectedCategory, 
  onCategoryChange, 
  categories = [],
  onCreateCategory 
}) => {
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#3b82f6');

  const categoryColors = [
    { value: '#3b82f6', label: 'Blue' },
    { value: '#10b981', label: 'Green' },
    { value: '#f59e0b', label: 'Yellow' },
    { value: '#ef4444', label: 'Red' },
    { value: '#8b5cf6', label: 'Purple' },
    { value: '#06b6d4', label: 'Cyan' },
    { value: '#f97316', label: 'Orange' },
    { value: '#84cc16', label: 'Lime' },
  ];

  const categoryOptions = [
    ...categories.map(cat => ({
      value: cat.id,
      label: cat.name,
      description: `${cat.noteCount || 0} notes`
    })),
    { value: 'create-new', label: '+ Create New Category' }
  ];

  const handleCategorySelect = (value) => {
    if (value === 'create-new') {
      setIsCreatingNew(true);
    } else {
      onCategoryChange(value);
    }
  };

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory = {
        id: Date.now().toString(),
        name: newCategoryName.trim(),
        color: newCategoryColor,
        noteCount: 0
      };
      
      onCreateCategory(newCategory);
      onCategoryChange(newCategory.id);
      setIsCreatingNew(false);
      setNewCategoryName('');
      setNewCategoryColor('#3b82f6');
    }
  };

  const handleCancelCreate = () => {
    setIsCreatingNew(false);
    setNewCategoryName('');
    setNewCategoryColor('#3b82f6');
  };

  if (isCreatingNew) {
    return (
      <div className="space-y-4 p-4 bg-card border border-border rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-foreground">Create New Category</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancelCreate}
            className="h-6 w-6"
          >
            <Icon name="X" size={14} />
          </Button>
        </div>

        <Input
          label="Category Name"
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Enter category name"
          maxLength={30}
          required
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Color</label>
          <div className="flex items-center space-x-2">
            {categoryColors.map((color) => (
              <button
                key={color.value}
                onClick={() => setNewCategoryColor(color.value)}
                className={`w-8 h-8 rounded-full border-2 transition-micro ${
                  newCategoryColor === color.value 
                    ? 'border-foreground scale-110' 
                    : 'border-border hover:border-muted-foreground'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.label}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleCreateCategory}
            disabled={!newCategoryName.trim()}
            iconName="Plus"
            iconPosition="left"
          >
            Create
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancelCreate}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Select
        label="Category"
        description="Organize your notes with categories"
        options={categoryOptions}
        value={selectedCategory}
        onChange={handleCategorySelect}
        placeholder="Select a category"
        searchable={categories.length > 5}
      />
      
      {selectedCategory && categories.find(cat => cat.id === selectedCategory) && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: categories.find(cat => cat.id === selectedCategory)?.color }}
          />
          <span>{categories.find(cat => cat.id === selectedCategory)?.name}</span>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;