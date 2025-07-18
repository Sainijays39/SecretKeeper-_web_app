import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VersionHistory = ({ 
  versions = [], 
  onRestoreVersion, 
  onViewVersion,
  currentVersion 
}) => {
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleRestoreVersion = async (version) => {
    setIsRestoring(true);
    try {
      await onRestoreVersion(version);
    } finally {
      setIsRestoring(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    
    return date.toLocaleDateString();
  };

  const getVersionIcon = (version) => {
    if (version.isAutoSave) return 'Clock';
    if (version.isManualSave) return 'Save';
    if (version.isBackup) return 'Shield';
    return 'FileText';
  };

  const getVersionLabel = (version) => {
    if (version.isAutoSave) return 'Auto-saved';
    if (version.isManualSave) return 'Manual save';
    if (version.isBackup) return 'Backup';
    return 'Version';
  };

  if (versions.length === 0) {
    return (
      <div className="space-y-4 p-4 bg-card border border-border rounded-lg">
        <div className="flex items-center space-x-2">
          <Icon name="History" size={18} className="text-primary" />
          <h3 className="font-medium text-foreground">Version History</h3>
        </div>
        
        <div className="text-center py-8">
          <Icon name="History" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No version history available</p>
          <p className="text-sm text-muted-foreground mt-1">
            Versions will appear here as you save your note
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-card border border-border rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="History" size={18} className="text-primary" />
          <h3 className="font-medium text-foreground">Version History</h3>
        </div>
        <span className="text-sm text-muted-foreground">
          {versions.length} version{versions.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {versions.map((version, index) => {
          const isSelected = selectedVersion?.id === version.id;
          const isCurrent = currentVersion?.id === version.id;
          
          return (
            <div
              key={version.id}
              className={`p-3 rounded-lg border transition-micro cursor-pointer ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : isCurrent
                  ? 'border-success bg-success/5' :'border-border hover:border-muted-foreground hover:bg-muted/50'
              }`}
              onClick={() => setSelectedVersion(version)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Icon 
                    name={getVersionIcon(version)} 
                    size={16} 
                    className={`mt-0.5 ${
                      isCurrent ? 'text-success' : 'text-muted-foreground'
                    }`} 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-foreground">
                        {getVersionLabel(version)}
                      </span>
                      {isCurrent && (
                        <span className="text-xs bg-success/10 text-success px-2 py-1 rounded">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatTimestamp(version.timestamp)}
                    </p>
                    {version.changes && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {version.changes} characters changed
                      </p>
                    )}
                  </div>
                </div>

                {isSelected && !isCurrent && (
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewVersion(version);
                      }}
                      iconName="Eye"
                      className="h-8 w-8 p-0"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestoreVersion(version);
                      }}
                      loading={isRestoring}
                      iconName="RotateCcw"
                      className="h-8 w-8 p-0"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedVersion && !currentVersion?.id === selectedVersion.id && (
        <div className="pt-3 border-t border-border">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewVersion(selectedVersion)}
              iconName="Eye"
              iconPosition="left"
            >
              Preview
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => handleRestoreVersion(selectedVersion)}
              loading={isRestoring}
              iconName="RotateCcw"
              iconPosition="left"
            >
              Restore
            </Button>
          </div>
        </div>
      )}

      {/* Auto-save Notice */}
      <div className="flex items-start space-x-2 p-3 bg-muted/50 rounded-lg">
        <Icon name="Info" size={16} className="text-primary mt-0.5 shrink-0" />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Auto-save Enabled</p>
          <p>Your changes are automatically saved every 30 seconds and when you navigate away.</p>
        </div>
      </div>
    </div>
  );
};

export default VersionHistory;