import React from 'react';
import Icon from '../../../components/AppIcon';

const PasswordStrengthIndicator = ({ password, isVisible }) => {
  const requirements = [
    { id: 'length', label: 'At least 8 characters', test: (pwd) => pwd.length >= 8 },
    { id: 'uppercase', label: 'One uppercase letter', test: (pwd) => /[A-Z]/.test(pwd) },
    { id: 'lowercase', label: 'One lowercase letter', test: (pwd) => /[a-z]/.test(pwd) },
    { id: 'number', label: 'One number', test: (pwd) => /\d/.test(pwd) },
    { id: 'special', label: 'One special character', test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) }
  ];

  const getStrengthScore = () => {
    return requirements.filter(req => req.test(password)).length;
  };

  const getStrengthLevel = () => {
    const score = getStrengthScore();
    if (score < 2) return { level: 'Weak', color: 'text-error', bgColor: 'bg-error' };
    if (score < 4) return { level: 'Fair', color: 'text-warning', bgColor: 'bg-warning' };
    if (score < 5) return { level: 'Good', color: 'text-primary', bgColor: 'bg-primary' };
    return { level: 'Strong', color: 'text-success', bgColor: 'bg-success' };
  };

  if (!isVisible || !password) return null;

  const strength = getStrengthLevel();
  const score = getStrengthScore();

  return (
    <div className="mt-3 p-3 bg-muted/50 rounded-lg border border-border">
      {/* Strength Bar */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">Password Strength</span>
        <span className={`text-sm font-medium ${strength.color}`}>{strength.level}</span>
      </div>
      
      <div className="w-full bg-border rounded-full h-2 mb-3">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${strength.bgColor}`}
          style={{ width: `${(score / 5) * 100}%` }}
        ></div>
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-1">
        {requirements.map((req) => {
          const isValid = req.test(password);
          return (
            <div key={req.id} className="flex items-center space-x-2">
              <Icon 
                name={isValid ? "CheckCircle" : "Circle"} 
                size={14} 
                className={isValid ? "text-success" : "text-muted-foreground"} 
              />
              <span className={`text-xs ${isValid ? "text-success" : "text-muted-foreground"}`}>
                {req.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;