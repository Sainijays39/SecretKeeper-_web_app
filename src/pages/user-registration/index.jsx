import React from 'react';
import { Link } from 'react-router-dom';
import AuthenticationLayout from '../../components/ui/AuthenticationLayout';
import TrustSignals from './components/TrustSignals';
import RegistrationForm from './components/RegistrationForm';

const UserRegistration = () => {
  return (
    <AuthenticationLayout
      title="Create Your Account"
      subtitle="Join thousands of users who trust SecretKeeper with their sensitive information"
    >
      {/* Trust Signals */}
      <TrustSignals />

      {/* Registration Form */}
      <RegistrationForm />

      {/* Sign In Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link 
            to="/user-login" 
            className="font-medium text-primary hover:text-primary/80 transition-micro"
          >
            Sign in
          </Link>
        </p>
      </div>

      {/* Additional Security Information */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="text-center space-y-2">
          <h3 className="text-sm font-medium text-foreground">Why Choose SecretKeeper?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div>✓ End-to-end encryption</div>
            <div>✓ Zero-knowledge architecture</div>
            <div>✓ Regular security audits</div>
            <div>✓ GDPR compliant</div>
          </div>
        </div>
      </div>
    </AuthenticationLayout>
  );
};

export default UserRegistration;