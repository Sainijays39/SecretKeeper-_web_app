import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ShareOptions = ({
  noteId,
  onGenerateLink,
  onCopyLink,
  existingLinks = [], onRevokeLink
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareSettings, setShareSettings] = useState({
    expiresIn: '7d',
    requirePassword: false,
    allowDownload: true,
    viewLimit: null
  });

  const expirationOptions = [
  { value: '1h', label: '1 Hour' },
  { value: '24h', label: '24 Hours' },
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: 'never', label: 'Never Expires' }];


  const viewLimitOptions = [
  { value: null, label: 'Unlimited' },
  { value: 1, label: '1 View' },
  { value: 5, label: '5 Views' },
  { value: 10, label: '10 Views' },
  { value: 25, label: '25 Views' }];


  const handleGenerateLink = async () => {
    setIsGenerating(true);
    try {
      const linkData = {
        noteId,
        ...shareSettings,
        createdAt: new Date().toISOString(),
        id: Date.now().toString()
      };

      await onGenerateLink(linkData);
    } finally {
      setIsGenerating(false);
    }
  };

  const formatExpirationDate = (expiresIn) => {
    const now = new Date();
    switch (expiresIn) {
      case '1h':
        return new Date(now.getTime() + 60 * 60 * 1000);
      case '24h':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case '7d':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case '30d':
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 p-4 bg-card border border-border rounded-lg">
      <div className="flex items-center space-x-2">
        <Icon name="Share" size={18} className="text-primary" />
        <h3 className="font-medium text-foreground">Share Options</h3>
      </div>

      {/* Share Settings */}
      <div className="space-y-4">
        <Select
          label="Link Expiration"
          description="When should the shared link expire?"
          options={expirationOptions}
          value={shareSettings.expiresIn}
          onChange={(value) => setShareSettings((prev) => ({ ...prev, expiresIn: value }))} />


        <Select
          label="View Limit"
          description="How many times can the link be accessed?"
          options={viewLimitOptions}
          value={shareSettings.viewLimit}
          onChange={(value) => setShareSettings((prev) => ({ ...prev, viewLimit: value }))} />


        <div className="space-y-3">
          <Checkbox
            label="Require password"
            description="Recipients will need a password to view the note"
            checked={shareSettings.requirePassword}
            onChange={(e) => setShareSettings((prev) => ({ ...prev, requirePassword: e.target.checked }))} />


          <Checkbox
            label="Allow download"
            description="Recipients can download the note as a file"
            checked={shareSettings.allowDownload}
            onChange={(e) => setShareSettings((prev) => ({ ...prev, allowDownload: e.target.checked }))} />

        </div>

        <Button
          variant="default"
          onClick={handleGenerateLink}
          loading={isGenerating}
          iconName="Link"
          iconPosition="left"
          fullWidth>

          Generate Secure Link
        </Button>
      </div>

      {/* Existing Links */}
      {existingLinks.length > 0 &&
      <div className="space-y-3">
          <h4 className="font-medium text-foreground">Active Links</h4>
          <div className="space-y-2">
            {existingLinks.map((link) =>
          <div key={link.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <Icon name="Link" size={14} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      Shared Link
                    </span>
                    {link.viewLimit &&
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {link.viewsRemaining || link.viewLimit} views left
                      </span>
                }
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {link.expiresIn === 'never' ? 'Never expires' :
                `Expires ${formatExpirationDate(link.expiresIn)?.toLocaleDateString()}`
                }
                  </p>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Button
                variant="ghost"
                size="sm"
                onClick={() => onCopyLink(link)}
                iconName="Copy"
                className="h-8 w-8 p-0" />

                  <Button
                variant="ghost"
                size="sm"
                onClick={() => onRevokeLink(link.id)}
                iconName="Trash2"
                className="h-8 w-8 p-0 text-error hover:text-error" />

                </div>
              </div>
          )}
          </div>
        </div>
      }

      {/* Security Warning */}
      <div className="flex items-start space-x-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
        <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5 shrink-0" />
        <div className="text-sm">
          <p className="font-medium text-warning mb-1">Sharing Security</p>
          <p className="text-muted-foreground">
            Shared links provide read-only access to your note. Anyone with the link can view the content until it expires.
          </p>
        </div>
      </div>
    </div>);

};

export default ShareOptions;