import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const SearchHeader = ({ searchQuery, onSearchChange, sortBy, onSortChange, onToggleFilters, showFilters }) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [localSearch, onSearchChange]);

  const sortOptions = [
    { value: 'updatedAt-desc', label: 'Recently Modified' },
    { value: 'updatedAt-asc', label: 'Oldest First' },
    { value: 'createdAt-desc', label: 'Recently Created' },
    { value: 'createdAt-asc', label: 'Oldest Created' },
    { value: 'title-asc', label: 'Title A-Z' },
    { value: 'title-desc', label: 'Title Z-A' },
    { value: 'category-asc', label: 'Category A-Z' }
  ];

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Icon name="Search" size={16} className="text-muted-foreground" />
        </div>
        <Input
          type="search"
          placeholder="Search notes, content, or tags..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="pl-10 pr-4"
        />
        {localSearch && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocalSearch('')}
            className="absolute inset-y-0 right-1 w-8 h-8 my-auto"
          >
            <Icon name="X" size={14} />
          </Button>
        )}
      </div>

      {/* Controls Row */}
      <div className="flex items-center justify-between gap-4">
        {/* Sort Dropdown */}
        <div className="flex-1 max-w-xs">
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={onSortChange}
            placeholder="Sort by..."
          />
        </div>

        {/* Filter Toggle */}
        <Button
          variant={showFilters ? "default" : "outline"}
          size="sm"
          onClick={onToggleFilters}
          className="lg:hidden"
        >
          <Icon name="Filter" size={16} className="mr-2" />
          Filters
        </Button>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="text-sm text-muted-foreground">
          Searching for: <span className="font-medium text-foreground">"{searchQuery}"</span>
        </div>
      )}
    </div>
  );
};

export default SearchHeader;