'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Paper,
  TextField,
  Button,
  Box,
} from '@mui/material';
import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';

interface MerchantFormData {
  name: string;
  longitude: string;
  latitude: string;
  image?: string;
}

export default function EditMerchant({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [formData, setFormData] = useState<MerchantFormData>({
    name: '',
    longitude: '',
    latitude: '',
    image: '',
  });

  const { data: merchant, isLoading } = useQuery({
    queryKey: ['merchant', params.id],
    queryFn: async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/merchants/${params.id}`);
      console.log('Fetched merchant:', response.data);
      return response.data;
    },
  });

  useEffect(() => {
    if (merchant) {
      console.log('Setting form data with:', merchant);
      setFormData({
        name: merchant.name,
        longitude: merchant.longitude.toString(),
        latitude: merchant.latitude.toString(),
        image: merchant.image || '',
      });
    }
  }, [merchant]);

  const editMerchantMutation = useMutation({
    mutationFn: async (data: MerchantFormData) => {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/merchants/${params.id}`, {
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
    editMerchantMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Merchant</h1>
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
                disabled={editMerchantMutation.isPending}
              >
                {editMerchantMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Box>
        </form>
      </Paper>
    </div>
  );
} 