import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthenticationLayout from '../../components/ui/AuthenticationLayout';
import LoginForm from './components/LoginForm';
import TrustIndicators from './components/TrustIndicators';
import SecurityStatus from './components/SecurityStatus';

const UserLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <AuthenticationLayout
          title="Welcome Back"
          subtitle="Sign in to access your secure notes and secrets"
        >
          <div className="space-y-6">
            <LoginForm />
            <SecurityStatus />
          </div>
        </AuthenticationLayout>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex lg:min-h-screen">
        {/* Left Side - Login Form */}
        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-elevation-1">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 text-primary-foreground"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-semibold text-foreground">SecretKeeper</h1>
                  <p className="text-sm text-muted-foreground">Secure Notes Platform</p>
                </div>
              </div>
              
              <h2 className="text-2xl font-semibold text-foreground mb-2">Welcome Back</h2>
              <p className="text-muted-foreground">Sign in to access your secure notes and secrets</p>
            </div>

            {/* Login Form */}
            <div className="bg-card rounded-xl shadow-elevation-2 p-8 border border-border">
              <LoginForm />
            </div>

            {/* Security Status */}
            <div className="mt-6">
              <SecurityStatus />
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-muted-foreground">
                Your data is encrypted end-to-end and stored securely. We cannot access your notes or passwords.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Trust Indicators */}
        <div className="w-96 bg-muted/30 border-l border-border p-8 flex flex-col justify-center">
          <TrustIndicators />
        </div>
      </div>
    </div>
  );
};

export default UserLogin;