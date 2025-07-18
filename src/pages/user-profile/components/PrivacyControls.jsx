import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const PrivacyControls = () => {
  const [encryptionLevel, setEncryptionLevel] = useState('aes-256');
  const [autoLogoutTimer, setAutoLogoutTimer] = useState('30');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const encryptionOptions = [
    { value: 'aes-128', label: 'AES-128 (Standard)', description: 'Good security for most users' },
    { value: 'aes-256', label: 'AES-256 (Recommended)', description: 'Maximum security encryption' },
    { value: 'chacha20', label: 'ChaCha20-Poly1305', description: 'Modern encryption algorithm' }
  ];

  const logoutTimerOptions = [
    { value: '5', label: '5 minutes' },
    { value: '15', label: '15 minutes' },
    { value: '30', label: '30 minutes' },
    { value: '60', label: '1 hour' },
    { value: '120', label: '2 hours' },
    { value: 'never', label: 'Never (Not recommended)' }
  ];

  const handleDeleteAccount = () => {
    if (deleteConfirmText.toLowerCase() === 'delete my account') {
      // Simulate account deletion process
      alert('Account deletion initiated. You will receive a confirmation email.');
      setShowDeleteConfirm(false);
      setDeleteConfirmText('');
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
          <Icon name="Lock" size={20} className="text-warning" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Privacy Controls</h3>
          <p className="text-sm text-muted-foreground">Manage your data privacy settings</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Data Encryption Level */}
        <div className="border border-border rounded-lg p-4">
          <div className="mb-4">
            <h4 className="font-medium text-foreground mb-2">Data Encryption Level</h4>
            <p className="text-sm text-muted-foreground">Choose how your notes are encrypted</p>
          </div>
          
          <Select
            options={encryptionOptions}
            value={encryptionLevel}
            onChange={setEncryptionLevel}
            placeholder="Select encryption level"
          />
          
          <div className="mt-3 p-3 bg-success/10 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="Shield" size={16} className="text-success" />
              <span className="text-sm text-success font-medium">
                Your data is encrypted with military-grade security
              </span>
            </div>
          </div>
        </div>

        {/* Auto-Logout Timer */}
        <div className="border border-border rounded-lg p-4">
          <div className="mb-4">
            <h4 className="font-medium text-foreground mb-2">Auto-Logout Timer</h4>
            <p className="text-sm text-muted-foreground">Automatically sign out after inactivity</p>
          </div>
          
          <Select
            options={logoutTimerOptions}
            value={autoLogoutTimer}
            onChange={setAutoLogoutTimer}
            placeholder="Select timeout duration"
          />
          
          {autoLogoutTimer === 'never' && (
            <div className="mt-3 p-3 bg-warning/10 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="AlertTriangle" size={16} className="text-warning" />
                <span className="text-sm text-warning font-medium">
                  Disabling auto-logout reduces security
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Data Privacy Options */}
        <div className="border border-border rounded-lg p-4">
          <div className="mb-4">
            <h4 className="font-medium text-foreground mb-2">Data Privacy Options</h4>
            <p className="text-sm text-muted-foreground">Control how your data is handled</p>
          </div>
          
          <div className="space-y-4">
            <Checkbox
              label="Enable zero-knowledge encryption"
              description="We cannot access your data even if we wanted to"
              checked
              disabled
            />
            
            <Checkbox
              label="Allow encrypted data backup"
              description="Create secure backups of your encrypted notes"
              checked
              onChange={() => {}}
            />
            
            <Checkbox
              label="Enable secure data sync"
              description="Sync your encrypted notes across devices"
              checked
              onChange={() => {}}
            />
          </div>
        </div>

        {/* Storage Information */}
        <div className="border border-border rounded-lg p-4">
          <div className="mb-4">
            <h4 className="font-medium text-foreground mb-2">Storage Usage</h4>
            <p className="text-sm text-muted-foreground">Current usage of your secure storage</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Notes Storage</span>
              <span className="text-sm text-muted-foreground">2.4 MB / 100 MB</span>
            </div>
            
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '2.4%' }}></div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>97.6 MB available</span>
              <Button variant="link" size="sm">
                Upgrade Storage
              </Button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="border border-error/20 rounded-lg p-4 bg-error/5">
          <div className="mb-4">
            <h4 className="font-medium text-error mb-2">Danger Zone</h4>
            <p className="text-sm text-muted-foreground">Irreversible actions that affect your account</p>
          </div>
          
          {!showDeleteConfirm ? (
            <Button 
              variant="destructive" 
              onClick={() => setShowDeleteConfirm(true)}
              iconName="Trash2"
              iconPosition="left"
            >
              Delete Account
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-error/10 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Icon name="AlertTriangle" size={20} className="text-error mt-0.5" />
                  <div>
                    <h5 className="font-medium text-error mb-2">Are you absolutely sure?</h5>
                    <p className="text-sm text-muted-foreground mb-3">
                      This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                    </p>
                    <p className="text-sm font-medium text-foreground mb-2">
                      Type "delete my account" to confirm:
                    </p>
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                      placeholder="delete my account"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText.toLowerCase() !== 'delete my account'}
                >
                  Delete Account Permanently
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivacyControls;