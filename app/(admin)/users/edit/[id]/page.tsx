'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Paper,
  TextField,
  Button,
  Box,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';

interface UserFormData {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  password?: string;
}

export default function EditUser({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    firstName: '',
    lastName: '',
    role: '',
    password: '',
  });

  // Fetch available roles
  const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/roles`);
      return res.data;
    },
  });

  // Fetch user data
  const { data: user, isLoading } = useQuery({
    queryKey: ['user', params.id],
    queryFn: async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${params.id}`);
      return response.data;
    },
  });

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        password: '', // Don't set password from fetched data
      });
    }
  }, [user]);

  const editUserMutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      // Remove password if it's empty
      if (!data.password) {
        const { password, ...dataWithoutPassword } = data;
        return axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${params.id}`, dataWithoutPassword);
      }
      return axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${params.id}`, data);
    },
    onSuccess: () => {
      router.push('/users');
      router.refresh();
    },
    onError: (error: any) => {
      setError(error.response?.data?.error || 'Failed to update user');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editUserMutation.mutate(formData);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit User</h1>
      <Paper className="p-6 max-w-md mx-auto">
        <form onSubmit={handleSubmit}>
          <Box className="space-y-4">
            {error && (
              <Alert severity="error" className="mb-4">
                {error}
              </Alert>
            )}
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="New Password (leave blank to keep current)"
              name="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                label="Role"
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
              >
                {roles?.map((role: { id: number, name: string }) => (
                  <MenuItem key={role.id} value={role.name}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outlined"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={editUserMutation.isPending}
              >
                {editUserMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Box>
        </form>
      </Paper>
    </div>
  );
} 