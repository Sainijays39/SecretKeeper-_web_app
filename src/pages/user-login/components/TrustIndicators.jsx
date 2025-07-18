import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustIndicators = () => {
  const securityFeatures = [
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
      description: 'No tracking or analytics'
    }
  ];

  const testimonials = [
    {
      quote: "SecretKeeper gives me peace of mind knowing my sensitive information is truly secure.",
      
    },
    {
      quote: "The encryption and privacy features are exactly what I needed for my confidential notes.",
      
    }
  ];

  return (
    <div className="space-y-8">
      {/* Security Features */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Your Security Matters</h3>
        <div className="space-y-3">
          {securityFeatures.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center shrink-0">
                <Icon name={feature.icon} size={16} className="text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{feature.title}</p>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SSL Badge */}
      <div className="bg-success/5 border border-success/20 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="ShieldCheck" size={20} className="text-success" />
          </div>
          <div>
            <p className="text-sm font-medium text-success">SSL Secured Connection</p>
            <p className="text-xs text-success/80">Your data is encrypted in transit</p>
          </div>
        </div>
      </div>

      {/* User Testimonials */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Trusted by Users</h3>
        <div className="space-y-4">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-foreground italic mb-3">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center space-x-2">
                
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Policy Link */}
      <div className="text-center">
        <a
          href="#"
          className="text-xs text-muted-foreground hover:text-foreground transition-micro"
        >
          Read our Privacy Policy & Terms of Service
        </a>
      </div>
    </div>
  );
};

export default TrustIndicators;