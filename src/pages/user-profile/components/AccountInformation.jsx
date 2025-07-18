import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AccountInformation = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "John Doe",
    email: "john.doe@example.com",
    joinDate: "March 15, 2024"
  });
  const [editData, setEditData] = useState({ ...formData });
  const [errors, setErrors] = useState({});

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...formData });
    setErrors({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ ...formData });
    setErrors({});
  };

  const handleSave = () => {
    const newErrors = {};
    
    if (!editData.displayName.trim()) {
      newErrors.displayName = "Display name is required";
    }
    
    if (!editData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setFormData({ ...editData });
    setIsEditing(false);
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="User" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Account Information</h3>
            <p className="text-sm text-muted-foreground">Manage your personal details</p>
          </div>
        </div>
        
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={handleEdit} iconName="Edit" iconPosition="left">
            Edit
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Profile Avatar */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
            <span className="text-xl font-semibold text-white">
              {formData.displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Profile Picture</p>
            <p className="text-xs text-muted-foreground">Auto-generated from your initials</p>
          </div>
        </div>

        {/* Display Name */}
        <div>
          {isEditing ? (
            <Input
              label="Display Name"
              type="text"
              value={editData.displayName}
              onChange={(e) => handleInputChange('displayName', e.target.value)}
              error={errors.displayName}
              placeholder="Enter your display name"
              required
            />
          ) : (
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">Display Name</label>
              <p className="text-foreground">{formData.displayName}</p>
            </div>
          )}
        </div>

        {/* Email */}
        <div>
          {isEditing ? (
            <Input
              label="Email Address"
              type="email"
              value={editData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={errors.email}
              placeholder="Enter your email address"
              required
            />
          ) : (
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">Email Address</label>
              <p className="text-foreground">{formData.email}</p>
            </div>
          )}
        </div>

        {/* Join Date */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-1">Member Since</label>
          <p className="text-muted-foreground">{formData.joinDate}</p>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex items-center space-x-3 pt-4 border-t border-border">
            <Button variant="default" onClick={handleSave} iconName="Check" iconPosition="left">
              Save Changes
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountInformation;