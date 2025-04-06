'use client'
import React, { useState } from 'react';
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

interface RegisterUserForm {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: string;
}

export default function RegisterUser() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<RegisterUserForm>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'user',
  });

  // Fetch available roles
  const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/roles`);
      return res.data;
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: Omit<RegisterUserForm, 'confirmPassword'>) => {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/register`, data);
      return response.data;
    },
    onSuccess: () => {
      router.push('/users');
      router.refresh();
    },
    onError: (error: any) => {
      setError(error.response?.data?.error || 'Registration failed');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const { confirmPassword, ...submitData } = formData;
    registerMutation.mutate(submitData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Register New User</h1>
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
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                label="Role"
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? 'Registering...' : 'Register User'}
              </Button>
            </div>
          </Box>
        </form>
      </Paper>
    </div>
  );
} 