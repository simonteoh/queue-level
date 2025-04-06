'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Paper,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';

interface RoleFormData {
  name: string;
}

export default function EditRole({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
  });

  const { data: role, isLoading } = useQuery({
    queryKey: ['role', params.id],
    queryFn: async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/roles/${params.id}`);
      return response.data;
    },
  });

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
      });
    }
  }, [role]);

  const editRoleMutation = useMutation({
    mutationFn: async (data: RoleFormData) => {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/roles/${params.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      router.push('/roles');
      router.refresh();
    },
    onError: (error: any) => {
      setError(error.response?.data?.error || 'Failed to update role');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editRoleMutation.mutate(formData);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Role</h1>
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
              label="Role Name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              required
            />
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
                disabled={editRoleMutation.isPending}
              >
                {editRoleMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Box>
        </form>
      </Paper>
    </div>
  );
} 