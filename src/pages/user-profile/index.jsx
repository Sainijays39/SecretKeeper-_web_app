import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ContextualHeader from '../../components/ui/ContextualHeader';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import AccountInformation from './components/AccountInformation';
import SecuritySettings from './components/SecuritySettings';
import PrivacyControls from './components/PrivacyControls';
import NotificationPreferences from './components/NotificationPreferences';
import ExportBackup from './components/ExportBackup';
import Icon from '../../components/AppIcon';


const UserProfile = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('account');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Mock user data
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    joinDate: "March 15, 2024",
    lastLogin: "July 10, 2025 at 6:15 PM",
    notesCount: 24,
    storageUsed: "2.4 MB"
  };

  const sections = [
    {
      id: 'account',
      label: 'Account',
      icon: 'User',
      component: AccountInformation
    },
    {
      id: 'security',
      label: 'Security',
      icon: 'Shield',
      component: SecuritySettings
    },
    {
      id: 'privacy',
      label: 'Privacy',
      icon: 'Lock',
      component: PrivacyControls
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'Bell',
      component: NotificationPreferences
    },
    {
      id: 'backup',
      label: 'Backup',
      icon: 'Download',
      component: ExportBackup
    }
  ];

  const handleLogout = () => {
    if (hasUnsavedChanges) {
      const confirmLogout = window.confirm('You have unsaved changes. Are you sure you want to logout?');
      if (!confirmLogout) return;
    }
    
    // Clear any stored authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    // Navigate to login page
    navigate('/user-login');
  };

  const handleSectionChange = (sectionId) => {
    if (hasUnsavedChanges) {
      const confirmChange = window.confirm('You have unsaved changes. Are you sure you want to switch sections?');
      if (!confirmChange) return;
    }
    
    setActiveSection(sectionId);
    setHasUnsavedChanges(false);
  };

  // Simulate unsaved changes detection
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const ActiveComponent = sections.find(section => section.id === activeSection)?.component;

  const rightActions = [
    {
      icon: 'LogOut',
      label: 'Logout',
      onClick: handleLogout,
      variant: 'outline'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <ContextualHeader
        title="Profile Settings"
        subtitle="Manage your account and security preferences"
        rightActions={rightActions}
      />

      {/* Main Content */}
      <div className="lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <NavigationBreadcrumb />

          {/* Profile Header */}
          <div className="bg-card rounded-lg border border-border p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Avatar */}
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <span className="text-2xl font-semibold text-white">
                  {userData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
              
              {/* User Info */}
              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-foreground">{userData.name}</h1>
                <p className="text-muted-foreground">{userData.email}</p>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center space-x-1">
                    <Icon name="Calendar" size={14} />
                    <span>Joined {userData.joinDate}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Icon name="Clock" size={14} />
                    <span>Last login: {userData.lastLogin}</span>
                  </span>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-lg font-semibold text-foreground">{userData.notesCount}</p>
                  <p className="text-xs text-muted-foreground">Notes</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-lg font-semibold text-foreground">{userData.storageUsed}</p>
                  <p className="text-xs text-muted-foreground">Storage</p>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Navigation & Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Desktop Sidebar Navigation */}
            <div className="hidden lg:block">
              <div className="bg-card rounded-lg border border-border p-4 sticky top-24">
                <h3 className="font-semibold text-foreground mb-4">Settings</h3>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => handleSectionChange(section.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-micro ${
                        activeSection === section.id
                          ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon 
                        name={section.icon} 
                        size={18} 
                        className={activeSection === section.id ? 'text-primary' : 'text-current'} 
                      />
                      <span className="font-medium">{section.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Mobile Section Selector */}
            <div className="lg:hidden col-span-1">
              <div className="bg-card rounded-lg border border-border p-4 mb-6">
                <div className="flex items-center space-x-2 overflow-x-auto">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => handleSectionChange(section.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-micro ${
                        activeSection === section.id
                          ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon 
                        name={section.icon} 
                        size={16} 
                        className={activeSection === section.id ? 'text-primary' : 'text-current'} 
                      />
                      <span className="text-sm font-medium">{section.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {hasUnsavedChanges && (
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <Icon name="AlertTriangle" size={20} className="text-warning" />
                    <div>
                      <p className="font-medium text-warning">Unsaved Changes</p>
                      <p className="text-sm text-muted-foreground">
                        You have unsaved changes that will be lost if you navigate away.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {ActiveComponent && <ActiveComponent />}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomTabNavigation />
      
      {/* Safe area for mobile */}
      <div className="h-20 lg:hidden"></div>
    </div>
  );
};

export default UserProfile;