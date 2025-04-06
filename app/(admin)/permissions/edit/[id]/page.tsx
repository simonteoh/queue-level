'use client'
import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  Alert,
  List,
  ListItem,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Role {
  id: number;
  name: string;
  role_permissions: {
    permission: {
      id: number;
      name: string;
    };
  }[];
}

interface Permission {
  id: number;
  name: string;
}

export default function EditPermission({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  // Fetch role and its current permissions
  const { data: role, isLoading: roleLoading } = useQuery<Role>({
    queryKey: ['role', params.id],
    queryFn: async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/roles/${params.id}`, {
        params: {
          include: 'permissions' // Tell API to include permissions
        }
      });
      const roleData = response.data;
      // Set initial selected permissions
      const currentPermissions = roleData.role_permissions.map(
        (rp: { permission: { id: number } }) => rp.permission.id
      );
      setSelectedPermissions(currentPermissions);
      return roleData;
    },
  });

  // Fetch all available permissions
  const { data: permissions, isLoading: permissionsLoading } = useQuery<Permission[]>({
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

  const updatePermissionsMutation = useMutation({
    mutationFn: async () => {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/permissions/role/${params.id}`, {
        permissions: selectedPermissions,
      });
    },
    onSuccess: () => {
      toast.success('Permissions updated successfully');
      router.push('/permissions');
      router.refresh();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update permissions');
      setError(error.response?.data?.error || 'Failed to update permissions');
    },
  });

  const handlePermissionToggle = (permissionId: number) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permissionId)) {
        return prev.filter(id => id !== permissionId);
      }
      return [...prev, permissionId];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePermissionsMutation.mutate();
  };

  if (roleLoading || permissionsLoading) {
    return <div>Loading...</div>;
  }

  if (!role || !permissions) {
    return <div>Role not found</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Role Permissions</h1>
      <Paper className="p-6">
        <form onSubmit={handleSubmit}>
          <Box className="space-y-4">
            {error && (
              <Alert severity="error" className="mb-4">
                {error}
              </Alert>
            )}

            <Typography variant="h6" gutterBottom>
              Role: {role.name}
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

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={updatePermissionsMutation.isPending}
              >
                {updatePermissionsMutation.isPending ? 'Saving...' : 'Save Changes'}
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