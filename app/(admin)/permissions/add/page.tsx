'use client'
import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Role {
  id: number;
  name: string;
}

interface Permission {
  id: number;
  name: string;
}

export default function AddPermission() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<number | ''>('');
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [error, setError] = useState('');

  // Fetch roles
  const { data: roles } = useQuery<Role[]>({
    queryKey: ['roles'],
    queryFn: async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/roles`);
      return response.data;
    },
  });

  // Fetch available permissions
  const { data: permissions } = useQuery<Permission[]>({
    queryKey: ['permissions'],
    queryFn: async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/permissions`);
      return response.data;
    },
  });

  // Group permissions by module
  const groupedPermissions = permissions?.reduce((acc, permission) => {
    const [action, module] = permission.name.split('_');
    if (!acc[module]) {
      acc[module] = [];
    }
    acc[module].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>) || {};

  const addPermissionMutation = useMutation({
    mutationFn: async () => {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/permissions/role`, {
        roleId: selectedRole,
        permissions: selectedPermissions,
      });
    },
    onSuccess: () => {
      toast.success('Permissions added successfully');
      router.push('/permissions');
      router.refresh();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to add permissions');
      setError(error.response?.data?.error || 'Failed to add permissions');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }
    if (selectedPermissions.length === 0) {
      setError('Please select at least one permission');
      return;
    }
    addPermissionMutation.mutate();
  };

  const handlePermissionToggle = (permissionId: number) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permissionId)) {
        return prev.filter(id => id !== permissionId);
      }
      return [...prev, permissionId];
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Add Role Permissions</h1>
      <Paper className="p-6">
        <form onSubmit={handleSubmit}>
          <Box className="space-y-4">
            {error && (
              <Alert severity="error" className="mb-4">
                {error}
              </Alert>
            )}

            <FormControl fullWidth>
              <InputLabel>Select Role</InputLabel>
              <Select
                value={selectedRole}
                label="Select Role"
                onChange={(e) => setSelectedRole(e.target.value as number)}
              >
                {roles?.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedRole && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Select Permissions
                </Typography>
                {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
                  <Box key={module} className="mb-4">
                    <Typography variant="subtitle1" className="font-bold">
                      {module.charAt(0).toUpperCase() + module.slice(1)}
                    </Typography>
                    <List>
                      {modulePermissions.map((permission) => (
                        <ListItem key={permission.id} dense>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={selectedPermissions.includes(permission.id)}
                                onChange={() => handlePermissionToggle(permission.id)}
                              />
                            }
                            label={permission.name.split('_')[0]}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                ))}
              </Box>
            )}

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={addPermissionMutation.isPending}
              >
                {addPermissionMutation.isPending ? 'Adding...' : 'Add Permissions'}
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </Box>
        </form>
      </Paper>
    </div>
  );
} 