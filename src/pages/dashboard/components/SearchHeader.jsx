import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const SearchHeader = ({ onSearch, userName }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      navigate('/notes-list', { state: { searchQuery } });
    }
  };

  const handleSearchToggle = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (isSearchExpanded) {
      setSearchQuery('');
    }
  };

  const handleProfileClick = () => {
    navigate('/user-profile');
  };

  return (
    <div className="lg:hidden bg-card border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo and App Name */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Shield" size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">SecretKeeper</h1>
          </div>
        </div>

        {/* Search and Profile */}
        <div className="flex items-center space-x-2">
          {!isSearchExpanded ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSearchToggle}
              >
                <Icon name="Search" size={20} />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleProfileClick}
                className="relative"
              >
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} className="text-primary" />
                </div>
              </Button>
            </>
          ) : (
            <div className="flex items-center space-x-2 flex-1 ml-4">
              <form onSubmit={handleSearch} className="flex-1">
                <Input
                  type="search"
                  placeholder="Search your notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </form>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSearchToggle}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Expanded Search Bar */}
      {isSearchExpanded && (
        <div className="mt-3">
          <form onSubmit={handleSearch}>
            <Input
              type="search"
              placeholder="Search notes, categories, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </form>
        </div>
      )}
    </div>
  );
};

export default SearchHeader;