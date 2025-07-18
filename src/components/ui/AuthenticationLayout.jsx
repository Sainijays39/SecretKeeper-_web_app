import React from 'react';
import Icon from '../AppIcon';

const AuthenticationLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal Header */}
      <header className="w-full py-6 px-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-elevation-1">
              <Icon name="Shield" size={24} className="text-primary-foreground" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-foreground">SecretKeeper</h1>
              <p className="text-sm text-muted-foreground">Secure Notes Platform</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Trust Signals */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-6 mb-6">
              <div className="flex items-center space-x-2 text-success">
                <Icon name="Shield" size={16} />
                <span className="text-xs font-medium">256-bit Encryption</span>
              </div>
              <div className="flex items-center space-x-2 text-success">
                <Icon name="Lock" size={16} />
                <span className="text-xs font-medium">Zero Knowledge</span>
              </div>
            </div>
            
            {title && (
              <h2 className="text-2xl font-semibold text-foreground mb-2">{title}</h2>
            )}
            {subtitle && (
              <p className="text-muted-foreground">{subtitle}</p>
            )}
          </div>

          {/* Form Container */}
          <div className="bg-card rounded-xl shadow-elevation-2 p-6 border border-border">
            {children}
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Your data is encrypted end-to-end and stored securely. We cannot access your notes or passwords.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <span>© 2025 SecretKeeper</span>
            <span>•</span>
            <a href="#" className="hover:text-foreground transition-micro">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-foreground transition-micro">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthenticationLayout;