'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Paper,
  TextField,
  Button,
  Box,
} from '@mui/material';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

interface MerchantFormData {
  name: string;
  longitude: string;
  latitude: string;
  image?: string;
}

export default function AddMerchant() {
  const router = useRouter();
  const [formData, setFormData] = useState<MerchantFormData>({
    name: '',
    longitude: '',
    latitude: '',
    image: '',
  });

  const addMerchantMutation = useMutation({
    mutationFn: async (data: MerchantFormData) => {
      const response = await axios.post('/api/merchants', {
        ...data,
        longitude: parseFloat(data.longitude),
        latitude: parseFloat(data.latitude),
      });
      return response.data;
    },
    onSuccess: () => {
      router.push('/merchants');
      router.refresh();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMerchantMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Merchant</h1>
      <Paper className="p-4 max-w-md mx-auto">
        <form onSubmit={handleSubmit}>
          <Box className="space-y-4">
            <TextField
              fullWidth
              label="Merchant Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Longitude"
              name="longitude"
              type="number"
              value={formData.longitude}
              onChange={handleChange}
              required
              inputProps={{
                step: 'any'
              }}
            />
            <TextField
              fullWidth
              label="Latitude"
              name="latitude"
              type="number"
              value={formData.latitude}
              onChange={handleChange}
              required
              inputProps={{
                step: 'any'
              }}
            />
            <TextField
              fullWidth
              label="Image URL"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
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
                disabled={addMerchantMutation.isPending}
              >
                {addMerchantMutation.isPending ? 'Adding...' : 'Add Merchant'}
              </Button>
            </div>
          </Box>
        </form>
      </Paper>
    </div>
  );
} 