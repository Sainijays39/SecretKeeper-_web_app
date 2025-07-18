import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const NotificationPreferences = () => {
  const [emailNotifications, setEmailNotifications] = useState({
    securityAlerts: true,
    loginNotifications: true,
    featureUpdates: false,
    maintenanceAlerts: true,
    weeklyDigest: false
  });

  const [notificationFrequency, setNotificationFrequency] = useState('immediate');

  const frequencyOptions = [
    { value: 'immediate', label: 'Immediate' },
    { value: 'daily', label: 'Daily Digest' },
    { value: 'weekly', label: 'Weekly Summary' },
    { value: 'never', label: 'Never' }
  ];

  const handleNotificationChange = (key, checked) => {
    setEmailNotifications(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  const notificationTypes = [
    {
      key: 'securityAlerts',
      title: 'Security Alerts',
      description: 'Important security notifications and warnings',
      icon: 'Shield',
      iconColor: 'text-error',
      bgColor: 'bg-error/10',
      recommended: true
    },
    {
      key: 'loginNotifications',
      title: 'Login Notifications',
      description: 'Alerts when someone signs into your account',
      icon: 'LogIn',
      iconColor: 'text-warning',
      bgColor: 'bg-warning/10',
      recommended: true
    },
    {
      key: 'featureUpdates',
      title: 'Feature Updates',
      description: 'News about new features and improvements',
      icon: 'Sparkles',
      iconColor: 'text-primary',
      bgColor: 'bg-primary/10',
      recommended: false
    },
    {
      key: 'maintenanceAlerts',
      title: 'Maintenance Alerts',
      description: 'Scheduled maintenance and downtime notifications',
      icon: 'Settings',
      iconColor: 'text-secondary',
      bgColor: 'bg-secondary/10',
      recommended: true
    },
    {
      key: 'weeklyDigest',
      title: 'Weekly Activity Digest',
      description: 'Summary of your account activity and usage',
      icon: 'BarChart3',
      iconColor: 'text-success',
      bgColor: 'bg-success/10',
      recommended: false
    }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Bell" size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Notification Preferences</h3>
          <p className="text-sm text-muted-foreground">Customize how you receive updates</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Notification Frequency */}
        <div className="border border-border rounded-lg p-4">
          <div className="mb-4">
            <h4 className="font-medium text-foreground mb-2">Notification Frequency</h4>
            <p className="text-sm text-muted-foreground">How often you want to receive notifications</p>
          </div>
          
          <Select
            options={frequencyOptions}
            value={notificationFrequency}
            onChange={setNotificationFrequency}
            placeholder="Select frequency"
          />
        </div>

        {/* Email Notifications */}
        <div className="border border-border rounded-lg p-4">
          <div className="mb-4">
            <h4 className="font-medium text-foreground mb-2">Email Notifications</h4>
            <p className="text-sm text-muted-foreground">Choose which emails you want to receive</p>
          </div>
          
          <div className="space-y-4">
            {notificationTypes.map((notification) => (
              <div key={notification.key} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-micro">
                <div className={`w-10 h-10 ${notification.bgColor} rounded-lg flex items-center justify-center shrink-0`}>
                  <Icon name={notification.icon} size={18} className={notification.iconColor} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h5 className="font-medium text-foreground">{notification.title}</h5>
                    {notification.recommended && (
                      <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                </div>
                
                <div className="shrink-0">
                  <Checkbox
                    checked={emailNotifications[notification.key]}
                    onChange={(e) => handleNotificationChange(notification.key, e.target.checked)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Push Notifications */}
        <div className="border border-border rounded-lg p-4">
          <div className="mb-4">
            <h4 className="font-medium text-foreground mb-2">Browser Notifications</h4>
            <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Monitor" size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Browser Push Notifications</p>
                <p className="text-xs text-muted-foreground">Get notified even when the app is closed</p>
              </div>
            </div>
            <Checkbox
             
              onChange={() => {
                // Request notification permission
                if ('Notification' in window) {
                  Notification.requestPermission();
                }
              }}
            />
          </div>
        </div>

        {/* Notification Preview */}
        <div className="border border-border rounded-lg p-4">
          <div className="mb-4">
            <h4 className="font-medium text-foreground mb-2">Preview</h4>
            <p className="text-sm text-muted-foreground">Example of how notifications will look</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <div className="w-8 h-8 bg-error/10 rounded-lg flex items-center justify-center shrink-0">
                <Icon name="Shield" size={16} className="text-error" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Security Alert</p>
                <p className="text-xs text-muted-foreground">New login detected from Chrome on Windows</p>
                <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center shrink-0">
                <Icon name="CheckCircle" size={16} className="text-success" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Note Saved</p>
                <p className="text-xs text-muted-foreground">Your note "Meeting Notes" has been saved securely</p>
                <p className="text-xs text-muted-foreground mt-1">5 minutes ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;