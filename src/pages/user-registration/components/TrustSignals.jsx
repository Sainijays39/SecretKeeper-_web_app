import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustFeatures = [
    {
      icon: 'Shield',
      title: '256-bit Encryption',
      description: 'Military-grade security'
    },
    {
      icon: 'Lock',
      title: 'Zero Knowledge',
      description: 'We cannot access your data'
    },
    {
      icon: 'Eye',
      title: 'Privacy First',
      description: 'No tracking or ads'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-center mb-3">
        <Icon name="ShieldCheck" size={20} className="text-success mr-2" />
        <span className="text-sm font-medium text-foreground">Trusted by 50,000+ users</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {trustFeatures.map((feature, index) => (
          <div key={index} className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                <Icon name={feature.icon} size={16} className="text-success" />
              </div>
            </div>
            <h4 className="text-xs font-medium text-foreground mb-1">{feature.title}</h4>
            <p className="text-xs text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustSignals;