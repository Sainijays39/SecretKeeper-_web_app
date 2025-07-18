import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const { signUp, authError, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    displayName: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const requirements = [
      { test: (pwd) => pwd.length >= 8, message: 'Password must be at least 8 characters' },
      { test: (pwd) => /[A-Z]/.test(pwd), message: 'Password must contain uppercase letter' },
      { test: (pwd) => /[a-z]/.test(pwd), message: 'Password must contain lowercase letter' },
      { test: (pwd) => /\d/.test(pwd), message: 'Password must contain a number' },
      { test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd), message: 'Password must contain special character' }
    ];

    for (const req of requirements) {
      if (!req.test(password)) {
        return req.message;
      }
    }
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific error when user starts typing
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

    // Show password strength indicator when user starts typing password
    if (name === 'password') {
      setShowPasswordStrength(value.length > 0);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = '';

    switch (name) {
      case 'email':
        if (value && !validateEmail(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'password':
        if (value) {
          error = validatePassword(value);
        }
        break;
      case 'confirmPassword':
        if (value && value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;
      default:
        break;
    }

    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        newErrors.password = passwordError;
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const result = await signUp(formData.email, formData.password, {
        fullName: formData.fullName,
        displayName: formData.displayName || formData.fullName
      });
      
      if (result?.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.log('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Authentication Error Message */}
      {authError && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-4 flex items-start space-x-3">
          <Icon name="AlertCircle" size={20} className="text-error mt-0.5 shrink-0" />
          <div>
            <p className="text-error text-sm font-medium">Registration Failed</p>
            <p className="text-error/80 text-sm mt-1">{authError}</p>
          </div>
        </div>
      )}

      {/* Email Field */}
      <Input
        label="Email Address"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder="Enter your email"
        error={errors.email}
        required
        disabled={isLoading}
        className="mb-4"
      />

      {/* Full Name Field */}
      <Input
        label="Full Name"
        type="text"
        name="fullName"
        value={formData.fullName}
        onChange={handleInputChange}
        placeholder="Enter your full name"
        disabled={isLoading}
        className="mb-4"
      />

      {/* Display Name Field */}
      <Input
        label="Display Name (Optional)"
        type="text"
        name="displayName"
        value={formData.displayName}
        onChange={handleInputChange}
        placeholder="How should we address you?"
        description="This will be shown in your profile"
        disabled={isLoading}
        className="mb-4"
      />

      {/* Password Field */}
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder="Create a strong password"
          error={errors.password}
          required
          disabled={isLoading}
          className="mb-2"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-micro"
          disabled={isLoading}
        >
          <Icon name={showPassword ? "EyeOff" : "Eye"} size={16} />
        </button>
      </div>

      {/* Password Strength Indicator */}
      <PasswordStrengthIndicator 
        password={formData.password} 
        isVisible={showPasswordStrength} 
      />

      {/* Confirm Password Field */}
      <div className="relative">
        <Input
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder="Confirm your password"
          error={errors.confirmPassword}
          required
          disabled={isLoading}
          className="mb-4"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-micro"
          disabled={isLoading}
        >
          <Icon name={showConfirmPassword ? "EyeOff" : "Eye"} size={16} />
        </button>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={isLoading}
        disabled={isLoading}
        className="mt-6"
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>

      {/* Sign In Link */}
      <div className="text-center mt-4">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/user-login')}
            className="text-primary hover:text-primary/80 transition-micro font-medium"
            disabled={isLoading}
          >
            Sign In
          </button>
        </p>
      </div>
    </form>
  );
};

export default RegistrationForm;