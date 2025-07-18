import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ExportBackup = () => {
  const [exportFormat, setExportFormat] = useState('encrypted-json');
  const [backupPassword, setBackupPassword] = useState('');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [lastBackup, setLastBackup] = useState('June 15, 2025');

  const exportFormatOptions = [
    { 
      value: 'encrypted-json', 
      label: 'Encrypted JSON (Recommended)', 
      description: 'Secure format with password protection' 
    },
    { 
      value: 'plain-json', 
      label: 'Plain JSON', 
      description: 'Unencrypted format for easy import' 
    },
    { 
      value: 'csv', 
      label: 'CSV Format', 
      description: 'Spreadsheet compatible format' 
    },
    { 
      value: 'txt', 
      label: 'Plain Text', 
      description: 'Simple text format' 
    }
  ];

  const handleExport = async () => {
    if (exportFormat === 'encrypted-json' && !backupPassword) {
      alert('Please enter a backup password for encrypted export');
      return;
    }

    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      const mockData = {
        exportDate: new Date().toISOString(),
        totalNotes: 24,
        format: exportFormat,
        encrypted: exportFormat === 'encrypted-json',
        includeMetadata,
        notes: [
          {
            id: 1,
            title: "Meeting Notes - Q3 Planning",
            content: "Discussed quarterly goals and objectives...",
            createdAt: "2025-07-08T10:30:00Z",
            updatedAt: "2025-07-08T11:15:00Z",
            tags: ["work", "planning"]
          },
          {
            id: 2,
            title: "Personal Thoughts",
            content: "Reflections on recent events...",
            createdAt: "2025-07-07T20:45:00Z",
            updatedAt: "2025-07-07T21:00:00Z",
            tags: ["personal"]
          }
        ]
      };

      const dataStr = JSON.stringify(mockData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `secretkeeper-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setIsExporting(false);
      setLastBackup(new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }));
    }, 2000);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.csv,.txt';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target.result);
            alert(`Successfully imported ${data.notes?.length || 0} notes`);
          } catch (error) {
            alert('Error importing file. Please check the format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
          <Icon name="Download" size={20} className="text-success" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Export & Backup</h3>
          <p className="text-sm text-muted-foreground">Backup your notes securely</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Backup Status */}
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-medium text-foreground">Backup Status</h4>
              <p className="text-sm text-muted-foreground">Last backup: {lastBackup}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-sm text-success font-medium">Up to date</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <p className="text-2xl font-semibold text-foreground">24</p>
              <p className="text-xs text-muted-foreground">Total Notes</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <p className="text-2xl font-semibold text-foreground">2.4 MB</p>
              <p className="text-xs text-muted-foreground">Data Size</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <p className="text-2xl font-semibold text-foreground">100%</p>
              <p className="text-xs text-muted-foreground">Encrypted</p>
            </div>
          </div>
        </div>

        {/* Export Settings */}
        <div className="border border-border rounded-lg p-4">
          <div className="mb-4">
            <h4 className="font-medium text-foreground mb-2">Export Settings</h4>
            <p className="text-sm text-muted-foreground">Configure your backup preferences</p>
          </div>
          
          <div className="space-y-4">
            <Select
              label="Export Format"
              options={exportFormatOptions}
              value={exportFormat}
              onChange={setExportFormat}
              placeholder="Select export format"
            />
            
            {exportFormat === 'encrypted-json' && (
              <Input
                label="Backup Password"
                type="password"
                value={backupPassword}
                onChange={(e) => setBackupPassword(e.target.value)}
                placeholder="Enter a strong password for encryption"
                description="This password will be required to restore your backup"
                required
              />
            )}
            
            <Checkbox
              label="Include metadata"
              description="Include creation dates, tags, and other metadata"
              checked={includeMetadata}
              onChange={(e) => setIncludeMetadata(e.target.checked)}
            />
          </div>
        </div>

        {/* Export Actions */}
        <div className="border border-border rounded-lg p-4">
          <div className="mb-4">
            <h4 className="font-medium text-foreground mb-2">Backup Actions</h4>
            <p className="text-sm text-muted-foreground">Export or import your notes</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="default"
              onClick={handleExport}
              loading={isExporting}
              iconName="Download"
              iconPosition="left"
              className="flex-1"
            >
              {isExporting ? 'Exporting...' : 'Export Notes'}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleImport}
              iconName="Upload"
              iconPosition="left"
              className="flex-1"
            >
              Import Notes
            </Button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="border border-warning/20 rounded-lg p-4 bg-warning/5">
          <div className="flex items-start space-x-3">
            <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
            <div>
              <h5 className="font-medium text-warning mb-2">Security Recommendations</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Always use encrypted format for sensitive data</li>
                <li>• Store backup files in a secure location</li>
                <li>• Use a strong, unique password for encrypted backups</li>
                <li>• Regularly test your backup files to ensure they work</li>
                <li>• Delete old backup files from unsecured locations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Automatic Backup */}
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Automatic Backup</h4>
              <p className="text-sm text-muted-foreground">Enable automatic weekly backups</p>
            </div>
            <Checkbox
             
              onChange={() => {
                alert('Automatic backup feature coming soon!');
              }}
            />
          </div>
          
          <div className="mt-3 p-3 bg-primary/10 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} className="text-primary" />
              <span className="text-sm text-primary font-medium">
                Coming Soon: Automatic encrypted backups to your preferred cloud storage
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportBackup;