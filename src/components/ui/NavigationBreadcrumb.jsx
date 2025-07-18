import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const NavigationBreadcrumb = ({ customBreadcrumbs }) => {
  const location = useLocation();

  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) return customBreadcrumbs;

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Home', path: '/dashboard', icon: 'Home' }];

    switch (location.pathname) {
      case '/dashboard':
        return [{ label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' }];
      
      case '/notes-list':
        return [
          { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
          { label: 'Notes', path: '/notes-list', icon: 'FileText' }
        ];
      
      case '/note-editor':
        return [
          { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
          { label: 'Notes', path: '/notes-list', icon: 'FileText' },
          { label: 'Editor', path: '/note-editor', icon: 'Edit' }
        ];
      
      case '/user-profile':
        return [
          { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
          { label: 'Profile', path: '/user-profile', icon: 'User' }
        ];
      
      default:
        return breadcrumbs;
    }
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const isFirst = index === 0;
          
          return (
            <li key={crumb.path} className="flex items-center space-x-2">
              {!isFirst && (
                <Icon name="ChevronRight" size={14} className="text-muted-foreground/60" />
              )}
              
              {isLast ? (
                <span className="flex items-center space-x-1.5 text-foreground font-medium">
                  {crumb.icon && <Icon name={crumb.icon} size={14} />}
                  <span className="hidden sm:inline">{crumb.label}</span>
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className="flex items-center space-x-1.5 hover:text-foreground transition-micro"
                >
                  {crumb.icon && <Icon name={crumb.icon} size={14} />}
                  <span className="hidden sm:inline">{crumb.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default NavigationBreadcrumb;