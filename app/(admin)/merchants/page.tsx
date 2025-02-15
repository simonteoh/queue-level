'use client'
import React from 'react';
import axios from 'axios'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import Image from 'next/image';
import { DEFAULT_IMAGE } from '@/app/constants';
import { useQuery } from '@tanstack/react-query'

interface MerchantProps {
  id: number,
  name: string,
  image?: string
}
export default function Merchants() {
  const getMerchants = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/merchants`)
      if (res) {
        return res.data
      }
    } catch (error) {

    }
  }
  const { isPending, isError, data: merchants, error } = useQuery<MerchantProps[]>({
    queryKey: ['getMerchants'],
    queryFn: getMerchants,
  })
  if (isPending) {
    return <span>Loading...</span>
  }

  if (isError) {
    console.log(error.message)
    return <span>Something went wrong! Please try again</span>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Merchants</h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="orders table">
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Image</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {merchants.length > 0 && merchants.map((merchant) => (
              <TableRow
                key={merchant.id}
                sx={{ '&:last-child td, &:last-child th': { bmerchant: 0 } }}
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
