import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const SecuritySettings = () => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showActiveSessions, setShowActiveSessions] = useState(false);

  const activeSessions = [
    {
      id: 1,
      device: "Chrome on Windows",
      location: "New York, NY",
      lastActive: "2 minutes ago",
      current: true
    },
    {
      id: 2,
      device: "Safari on iPhone",
      location: "New York, NY",
      lastActive: "1 hour ago",
      current: false
    },
    {
      id: 3,
      device: "Firefox on MacOS",
      location: "Boston, MA",
      lastActive: "2 days ago",
      current: false
    }
  ];

  const loginHistory = [
    {
      id: 1,
      timestamp: "July 10, 2025 at 6:15 PM",
      device: "Chrome on Windows",
      location: "New York, NY",
      status: "success"
    },
    {
      id: 2,
      timestamp: "July 10, 2025 at 8:30 AM",
      device: "Safari on iPhone",
      location: "New York, NY",
      status: "success"
    },
    {
      id: 3,
      timestamp: "July 9, 2025 at 11:45 PM",
      device: "Firefox on MacOS",
      location: "Boston, MA",
      status: "success"
    }
  ];

  const handlePasswordChange = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Simulate password change
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsChangingPassword(false);
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
      { strength: 0, label: '', color: '' },
      { strength: 1, label: 'Very Weak', color: 'text-error' },
      { strength: 2, label: 'Weak', color: 'text-warning' },
      { strength: 3, label: 'Fair', color: 'text-warning' },
      { strength: 4, label: 'Good', color: 'text-success' },
      { strength: 5, label: 'Strong', color: 'text-success' }
    ];

    return levels[strength];
  };

  const passwordStrength = getPasswordStrength(passwordData.newPassword);

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
          <Icon name="Shield" size={20} className="text-error" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Security Settings</h3>
          <p className="text-sm text-muted-foreground">Manage your account security</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Password Change */}
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-medium text-foreground">Password</h4>
              <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
            </div>
            {!isChangingPassword && (
              <Button variant="outline" size="sm" onClick={() => setIsChangingPassword(true)}>
                Change Password
              </Button>
            )}
          </div>

          {isChangingPassword && (
            <div className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                error={errors.currentPassword}
                placeholder="Enter current password"
                required
              />
              
              <div>
                <Input
                  label="New Password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  error={errors.newPassword}
                  placeholder="Enter new password"
                  required
                />
                {passwordData.newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            passwordStrength.strength <= 2 ? 'bg-error' :
                            passwordStrength.strength <= 3 ? 'bg-warning' : 'bg-success'
                          }`}
                          style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${passwordStrength.color}`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              <Input
                label="Confirm New Password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                error={errors.confirmPassword}
                placeholder="Confirm new password"
                required
              />
              
              <div className="flex items-center space-x-3">
                <Button variant="default" onClick={handlePasswordChange}>
                  Update Password
                </Button>
                <Button variant="outline" onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setErrors({});
                }}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Two-Factor Authentication */}
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Two-Factor Authentication</h4>
              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Checkbox
              checked={twoFactorEnabled}
              onChange={(e) => setTwoFactorEnabled(e.target.checked)}
            />
          </div>
          {twoFactorEnabled && (
            <div className="mt-4 p-3 bg-success/10 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span className="text-sm text-success font-medium">Two-factor authentication is enabled</span>
              </div>
            </div>
          )}
        </div>

        {/* Active Sessions */}
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-medium text-foreground">Active Sessions</h4>
              <p className="text-sm text-muted-foreground">Manage your logged-in devices</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowActiveSessions(!showActiveSessions)}
              iconName={showActiveSessions ? "ChevronUp" : "ChevronDown"}
              iconPosition="right"
            >
              {showActiveSessions ? 'Hide' : 'Show'}
            </Button>
          </div>

          {showActiveSessions && (
            <div className="space-y-3">
              {activeSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="Monitor" size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {session.device}
                        {session.current && (
                          <span className="ml-2 text-xs bg-success text-success-foreground px-2 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.location} • {session.lastActive}
                      </p>
                    </div>
                  </div>
                  {!session.current && (
                    <Button variant="ghost" size="sm" iconName="X">
                      End Session
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Login History */}
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-medium text-foreground">Recent Login Activity</h4>
              <p className="text-sm text-muted-foreground">Your recent sign-in history</p>
            </div>
          </div>

          <div className="space-y-3">
            {loginHistory.slice(0, 3).map((login) => (
              <div key={login.id} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{login.device}</p>
                  <p className="text-xs text-muted-foreground">
                    {login.timestamp} • {login.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;