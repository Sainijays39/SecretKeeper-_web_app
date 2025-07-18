import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const SecurityStatus = () => {
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [securityChecks, setSecurityChecks] = useState([
    { id: 'ssl', label: 'SSL Certificate', status: 'checking' },
    { id: 'encryption', label: 'End-to-End Encryption', status: 'checking' },
    { id: 'server', label: 'Server Security', status: 'checking' }
  ]);

  useEffect(() => {
    // Simulate security checks
    const checkSecurity = async () => {
      const checks = [...securityChecks];
      
      // Simulate checking each security feature
      for (let i = 0; i < checks.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        checks[i].status = 'verified';
        setSecurityChecks([...checks]);
      }
      
      setConnectionStatus('secure');
    };

    checkSecurity();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'checking':
        return <Icon name="Loader2" size={16} className="text-warning animate-spin" />;
      case 'verified':
        return <Icon name="CheckCircle" size={16} className="text-success" />;
      default:
        return <Icon name="AlertCircle" size={16} className="text-error" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'checking':
        return 'text-warning';
      case 'verified':
        return 'text-success';
      default:
        return 'text-error';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon 
            name={connectionStatus === 'secure' ? 'Shield' : 'Loader2'} 
            size={20} 
            className={connectionStatus === 'secure' ? 'text-success' : 'text-warning animate-spin'} 
          />
          <span className="text-sm font-medium text-foreground">
            {connectionStatus === 'secure' ? 'Secure Connection' : 'Verifying Security...'}
          </span>
        </div>
        <div className={`w-2 h-2 rounded-full ${
          connectionStatus === 'secure' ? 'bg-success' : 'bg-warning animate-pulse'
        }`}></div>
      </div>

      {/* Security Checks */}
      <div className="space-y-2">
        {securityChecks.map((check) => (
          <div key={check.id} className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{check.label}</span>
            <div className="flex items-center space-x-1">
              {getStatusIcon(check.status)}
              <span className={getStatusColor(check.status)}>
                {check.status === 'checking' ? 'Checking...' : 'Verified'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Security Notice */}
      {connectionStatus === 'secure' && (
        <div className="bg-success/5 border border-success/20 rounded p-3">
          <p className="text-xs text-success">
            <Icon name="Info" size={12} className="inline mr-1" />
            Your connection is fully encrypted and secure
          </p>
        </div>
      )}
    </div>
  );
};

export default SecurityStatus;