import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeSection = ({ userName, securityStatus }) => {
  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return 'Good morning';
    if (currentHour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 mb-6 border border-border">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-1">
            {getGreeting()}, {userName}!
          </h1>
          <p className="text-muted-foreground">
            Your secure vault is ready for new secrets
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium ${
            securityStatus === 'secure' ?'bg-success/10 text-success' :'bg-warning/10 text-warning'
          }`}>
            <Icon 
              name={securityStatus === 'secure' ? 'Shield' : 'AlertTriangle'} 
              size={14} 
            />
            <span className="hidden sm:inline">
              {securityStatus === 'secure' ? 'Secure' : 'Attention'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;