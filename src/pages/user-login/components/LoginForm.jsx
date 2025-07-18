import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const LoginForm = () => {
  const navigate = useNavigate();
  const { signIn, authError, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear auth error
    if (authError) {
      clearError();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await signIn(formData.email, formData.password);
      
      if (result?.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.log('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Authentication Error Message */}
      {authError && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-4 flex items-start space-x-3">
          <Icon name="AlertCircle" size={20} className="text-error mt-0.5 shrink-0" />
          <div>
            <p className="text-error text-sm font-medium">Authentication Failed</p>
            <p className="text-error/80 text-sm mt-1">{authError}</p>
          </div>
        </div>
      )}

      {/* Demo Credentials Info */}
      <div className="bg-info/10 border border-info/20 rounded-lg p-4">
        <p className="text-info text-sm font-medium mb-2">Demo Credentials (for testing):</p>
        <p className="text-info/80 text-sm">Email: user@secretkeeper.com</p>
        <p className="text-info/80 text-sm">Password: SecurePass123!</p>
      </div>

      {/* Email Input */}
      <Input
        label="Email Address"
        type="email"
        name="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleInputChange}
        error={errors.email}
        required
        disabled={loading}
      />

      {/* Password Input */}
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
          required
          disabled={loading}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-micro"
          disabled={loading}
        >
          <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
        </button>
      </div>

      {/* Remember Me Checkbox */}
      <div className="flex items-start space-x-3">
        <Checkbox
          name="rememberMe"
          checked={formData.rememberMe}
          onChange={handleInputChange}
          disabled={loading}
        />
        <div className="flex-1">
          <label className="text-sm font-medium text-foreground cursor-pointer">
            Remember me on this device
          </label>
          <p className="text-xs text-muted-foreground mt-1">
            Your session will remain active for 30 days. Only use on trusted devices.
          </p>
        </div>
      </div>

      {/* Sign In Button */}
      <Button
        type="submit"
        variant="default"
        loading={loading}
        disabled={loading}
        fullWidth
        className="h-12"
      >
        {loading ? 'Signing In...' : 'Sign In Securely'}
      </Button>

      {/* Secondary Actions */}
      <div className="space-y-4">
        <div className="text-center">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-primary hover:text-primary/80 transition-micro font-medium"
            disabled={loading}
          >
            Forgot your password?
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/user-registration')}
              className="text-primary hover:text-primary/80 transition-micro font-medium"
              disabled={loading}
            >
              Create New Account
            </button>
          </p>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;