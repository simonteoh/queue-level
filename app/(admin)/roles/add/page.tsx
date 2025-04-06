'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Paper,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

export default function AddRole() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const addRoleMutation = useMutation({
    mutationFn: async (roleName: string) => {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/roles`, { name: roleName });
      return response.data;
    },
    onSuccess: () => {
      router.push('/roles');
      router.refresh();
    },
    onError: (error: any) => {
      setError(error.response?.data?.error || 'Failed to create role');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addRoleMutation.mutate(name);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Role</h1>
      <Paper className="p-4 max-w-md mx-auto">
        <form onSubmit={handleSubmit}>
          <Box className="space-y-4">
            {error && (
              <Alert severity="error" className="mb-4">
                {error}
              </Alert>
            )}
            <TextField
              fullWidth
              label="Role Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <div className="flex gap-4">
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
                disabled={addRoleMutation.isPending}
              >
                {addRoleMutation.isPending ? 'Adding...' : 'Add Role'}
              </Button>
            </div>
          </Box>
        </form>
      </Paper>
    </div>
  );
} 