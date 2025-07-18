import React from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const PrivacySettings = ({ 
  privacyLevel, 
  onPrivacyChange,
  isEncrypted,
  onEncryptionToggle 
}) => {
  const privacyLevels = [
    {
      id: 'private',
      label: 'Private',
      description: 'Only you can see this note',
      icon: 'Lock'
    },
    {
      id: 'protected',
      label: 'Protected',
      description: 'Requires additional authentication to view',
      icon: 'Shield'
    },
    {
      id: 'archived',
      label: 'Archived',
      description: 'Hidden from main notes list',
      icon: 'Archive'
    }
  ];

  return (
    <div className="space-y-4 p-4 bg-card border border-border rounded-lg">
      <div className="flex items-center space-x-2">
        <Icon name="Shield" size={18} className="text-primary" />
        <h3 className="font-medium text-foreground">Privacy Settings</h3>
      </div>

      {/* Privacy Level Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Privacy Level</label>
        <div className="space-y-2">
          {privacyLevels.map((level) => (
            <label
              key={level.id}
              className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-micro ${
                privacyLevel === level.id
                  ? 'border-primary bg-primary/5' :'border-border hover:border-muted-foreground hover:bg-muted/50'
              }`}
            >
              <input
                type="radio"
                name="privacyLevel"
                value={level.id}
                checked={privacyLevel === level.id}
                onChange={(e) => onPrivacyChange(e.target.value)}
                className="mt-1 w-4 h-4 text-primary border-border focus:ring-primary focus:ring-2"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <Icon name={level.icon} size={16} className="text-muted-foreground" />
                  <span className="font-medium text-foreground">{level.label}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{level.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Additional Encryption */}
      <div className="pt-3 border-t border-border">
        <Checkbox
          label="Enable additional encryption"
          description="Encrypt note content with your master password for extra security"
          checked={isEncrypted}
          onChange={(e) => onEncryptionToggle(e.target.checked)}
        />
      </div>

      {/* Security Notice */}
      <div className="flex items-start space-x-2 p-3 bg-muted/50 rounded-lg">
        <Icon name="Info" size={16} className="text-primary mt-0.5 shrink-0" />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Security Notice</p>
          <p>All notes are encrypted in transit and at rest. Additional encryption provides an extra layer of protection for highly sensitive content.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;