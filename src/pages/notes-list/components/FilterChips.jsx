import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FilterChips = ({ activeFilters, onFilterChange, onClearFilters }) => {
  const categories = [
    { id: 'all', label: 'All Notes', icon: 'FileText' },
    { id: 'Personal', label: 'Personal', icon: 'User' },
    { id: 'Work', label: 'Work', icon: 'Briefcase' },
    { id: 'Ideas', label: 'Ideas', icon: 'Lightbulb' },
    { id: 'Passwords', label: 'Passwords', icon: 'Key' },
    { id: 'Finance', label: 'Finance', icon: 'DollarSign' },
    { id: 'Health', label: 'Health', icon: 'Heart' }
  ];

  const dateFilters = [
    { id: 'today', label: 'Today', icon: 'Calendar' },
    { id: 'week', label: 'This Week', icon: 'Calendar' },
    { id: 'month', label: 'This Month', icon: 'Calendar' }
  ];

  const specialFilters = [
    { id: 'favorites', label: 'Favorites', icon: 'Heart' },
    { id: 'encrypted', label: 'Encrypted', icon: 'Lock' }
  ];

  const handleFilterClick = (filterId) => {
    onFilterChange(filterId);
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(Boolean).length;
  };

  return (
    <div className="space-y-4">
      {/* Active Filters Summary */}
      {getActiveFilterCount() > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {getActiveFilterCount()} filter{getActiveFilterCount() > 1 ? 's' : ''} active
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-xs"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Category Filters */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-2">Categories</h4>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeFilters.category === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterClick(category.id)}
              className="text-xs"
            >
              <Icon name={category.icon} size={14} className="mr-1" />
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Date Filters */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-2">Date Range</h4>
        <div className="flex flex-wrap gap-2">
          {dateFilters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilters.dateRange === filter.id ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange('dateRange', filter.id)}
              className="text-xs"
            >
              <Icon name={filter.icon} size={14} className="mr-1" />
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Special Filters */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-2">Special</h4>
        <div className="flex flex-wrap gap-2">
          {specialFilters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilters[filter.id] ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange(filter.id)}
              className="text-xs"
            >
              <Icon name={filter.icon} size={14} className="mr-1" />
              {filter.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterChips;