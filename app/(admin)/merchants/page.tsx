'use client'
import React, { useState } from 'react';
import axios from 'axios'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import Image from 'next/image';
import { DEFAULT_IMAGE } from '@/app/constants';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface MerchantProps {
  id: number,
  name: string,
  image?: string,
  longitude: number,
  latitude: number,
}
export default function Merchants() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [merchantToDelete, setMerchantToDelete] = useState<number | null>(null);

  const getMerchants = async () => {
    try {
      const res = await axios.get(`/api/merchants`)
      if (res) {
        return res.data
      }
    } catch (error) {
      console.log(error)
    }
  }
  const { isPending, isError, data: merchants, error } = useQuery<MerchantProps[]>({
    queryKey: ['getMerchants'],
    queryFn: getMerchants,
  })

  const deleteMerchantMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`/api/merchants/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getMerchants'] });
      setDeleteDialogOpen(false);
      setMerchantToDelete(null);
    },
  });

  const handleDeleteClick = (id: number) => {
    setMerchantToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (merchantToDelete) {
      deleteMerchantMutation.mutate(merchantToDelete);
    }
  };

  if (isPending) {
    return <span>Loading...</span>
  }

  if (isError) {
    console.log(error.message)
    return <span>Something went wrong! Please try again</span>
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Merchants</h1>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => router.push('/merchants/add')}
        >
          Add Merchant
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="orders table">
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Image</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {merchants.length > 0 && merchants.map((merchant) => (
              <TableRow
                key={merchant.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{merchant.id}</TableCell>
                <TableCell>{merchant.name}</TableCell>
                <TableCell>
                  <Image
                    src={merchant.image ?? DEFAULT_IMAGE}
                    alt={merchant.name}
                    width={100}
                    height={100}
                    unoptimized
                    className="rounded-md object-cover"
                  />
                </TableCell>
                <TableCell align="center">
                  <div className="flex justify-center gap-2">
                    <IconButton
                      color="primary"
                      onClick={() => router.push(`/merchants/edit/${merchant.id}`)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(merchant.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Merchant</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this merchant? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={deleteMerchantMutation.isPending}
          >
            {deleteMerchantMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
