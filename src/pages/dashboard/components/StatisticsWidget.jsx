import React from 'react';
import Icon from '../../../components/AppIcon';

const StatisticsWidget = ({ stats }) => {
  const statisticItems = [
    {
      id: 'total-notes',
      label: 'Total Notes',
      value: stats.totalNotes,
      icon: 'FileText',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'categories',
      label: 'Categories',
      value: stats.categoriesUsed,
      icon: 'Tag',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'encrypted',
      label: 'Encrypted',
      value: stats.encryptedNotes,
      icon: 'Shield',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'storage',
      label: 'Storage Used',
      value: `${stats.storageUsed}%`,
      icon: 'HardDrive',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Statistics</h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statisticItems.map((item) => (
          <div
            key={item.id}
            className="bg-card rounded-lg border border-border p-4 hover:shadow-elevation-1 transition-micro"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-lg ${item.bgColor} flex items-center justify-center`}>
                <Icon name={item.icon} size={20} className={item.color} />
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-2xl font-semibold text-foreground">{item.value}</p>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Security Status */}
      <div className="mt-4 bg-success/10 rounded-lg border border-success/20 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
            <Icon name="Shield" size={20} className="text-success" />
          </div>
          <div>
            <p className="font-medium text-success">End-to-End Encryption Active</p>
            <p className="text-sm text-success/80">Your data is protected with 256-bit AES encryption</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsWidget;