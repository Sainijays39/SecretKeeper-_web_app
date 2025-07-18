import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CategoriesSidebar = ({ categories = [], onCategorySelect }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    onCategorySelect?.(category);
    navigate('/notes-list', { state: { selectedCategory: category } });
  };

  const getIconName = (iconName) => {
    // Map category icons to available icons
    const iconMap = {
      'User': 'User',
      'Briefcase': 'Briefcase',
      'Lock': 'Lock',
      'Tag': 'Tag',
      'Heart': 'Heart',
      'Star': 'Star',
      'Home': 'Home',
      'Car': 'Car',
      'Plane': 'Plane',
      'Camera': 'Camera'
    };
    return iconMap[iconName] || 'Tag';
  };

  return (
    <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-50 pt-16">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground mb-4">Categories</h3>
        
        <Button
          variant="default"
          size="sm"
          fullWidth
          onClick={() => navigate('/note-editor')}
          iconName="Plus"
          iconPosition="left"
        >
          New Note
        </Button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <div className="space-y-2">
          {/* All Notes */}
          <button
            onClick={() => navigate('/notes-list')}
            className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg hover:bg-muted transition-micro"
          >
            <Icon name="FileText" size={20} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">All Notes</span>
          </button>

          {/* Category List */}
          {categories?.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className="w-full flex items-center justify-between px-3 py-2 text-left rounded-lg hover:bg-muted transition-micro group"
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-micro">
                  {category.name}
                </span>
              </div>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {category.note_count || 0}
              </span>
            </button>
          ))}

          {categories?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="FolderOpen" size={32} className="mx-auto mb-2" />
              <p className="text-sm">No categories yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesSidebar;