import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const BottomTabNavigation = () => {
  const location = useLocation();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      tooltip: 'Overview and quick actions'
    },
    {
      label: 'Notes',
      path: '/notes-list',
      icon: 'FileText',
      tooltip: 'Manage your secure notes'
    },
    {
      label: 'Profile',
      path: '/user-profile',
      icon: 'User',
      tooltip: 'Account and security settings'
    }
  ];

  const isActive = (path) => {
    if (path === '/notes-list' && location.pathname === '/note-editor') {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-100 safe-area-pb">
        <div className="flex items-center justify-around px-4 py-2">
          {navigationItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-micro group relative ${
                  active
                    ? 'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon
                  name={item.icon}
                  size={20}
                  className={`mb-1 ${active ? 'text-primary' : 'text-current'}`}
                />
                <span className="text-xs font-medium">{item.label}</span>
                
                {/* Tooltip for mobile (appears on long press) */}
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-elevation-2 opacity-0 group-hover:opacity-100 transition-micro pointer-events-none whitespace-nowrap">
                  {item.tooltip}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sidebar Navigation */}
      <nav className="hidden lg:flex lg:fixed lg:left-0 lg:top-0 lg:h-full lg:w-64 lg:bg-card lg:border-r lg:border-border lg:z-100 lg:flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Shield" size={20} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">SecretKeeper</h1>
              <p className="text-xs text-muted-foreground">Secure Notes</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-4 py-6">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-micro group ${
                    active
                      ? 'text-primary bg-primary/10 shadow-elevation-1'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon
                    name={item.icon}
                    size={20}
                    className={active ? 'text-primary' : 'text-current'}
                  />
                  <span className="font-medium">{item.label}</span>
                  
                  {/* Active indicator */}
                  {active && (
                    <div className="ml-auto w-2 h-2 bg-primary rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Security Status */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Icon name="Shield" size={14} className="text-success" />
            <span>Secure Connection</span>
          </div>
        </div>
      </nav>
    </>
  );
};

export default BottomTabNavigation;