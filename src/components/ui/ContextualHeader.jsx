import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const ContextualHeader = ({ 
  title, 
  leftAction, 
  rightActions = [], 
  showBack = false,
  subtitle,
  loading = false 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (leftAction?.onClick) {
      leftAction.onClick();
    } else {
      navigate(-1);
    }
  };

  const getPageTitle = () => {
    if (title) return title;
    
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/notes-list':
        return 'My Notes';
      case '/note-editor':
        return 'Note Editor';
      case '/user-profile':
        return 'Profile';
      default:
        return 'SecretKeeper';
    }
  };

  const getPageSubtitle = () => {
    if (subtitle) return subtitle;
    
    switch (location.pathname) {
      case '/dashboard':
        return 'Overview and quick actions';
      case '/notes-list':
        return 'Manage your secure notes';
      case '/note-editor':
        return 'Create and edit notes securely';
      case '/user-profile':
        return 'Account and security settings';
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-200">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Logo (hidden on desktop with sidebar) */}
          <div className="lg:hidden flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Shield" size={20} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">SecretKeeper</h1>
            </div>
          </div>

          {/* Back Button */}
          {(showBack || leftAction) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="shrink-0"
            >
              <Icon name={leftAction?.icon || "ArrowLeft"} size={20} />
            </Button>
          )}

          {/* Title Section */}
          <div className="hidden sm:block">
            <h2 className="text-xl font-semibold text-foreground">{getPageTitle()}</h2>
            {getPageSubtitle() && (
              <p className="text-sm text-muted-foreground">{getPageSubtitle()}</p>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {loading && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm hidden sm:inline">Saving...</span>
            </div>
          )}
          
          {rightActions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || "ghost"}
              size={action.size || "default"}
              onClick={action.onClick}
              disabled={action.disabled}
              className={action.className}
            >
              {action.icon && (
                <Icon 
                  name={action.icon} 
                  size={action.iconSize || 20} 
                  className={action.label ? "mr-2" : ""} 
                />
              )}
              {action.label && <span className="hidden sm:inline">{action.label}</span>}
            </Button>
          ))}
        </div>
      </div>

      {/* Mobile Title (shown below header on small screens) */}
      <div className="sm:hidden px-4 pb-3">
        <h2 className="text-lg font-semibold text-foreground">{getPageTitle()}</h2>
        {getPageSubtitle() && (
          <p className="text-sm text-muted-foreground">{getPageSubtitle()}</p>
        )}
      </div>
    </header>
  );
};

export default ContextualHeader;