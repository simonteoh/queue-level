'use client'
import React from 'react';
import { Typography, Paper } from '@mui/material';

export default function Dashboard() {
  return (
    <div className="p-4">
      <Typography variant="h4" className="mb-4">
        Dashboard
      </Typography>
      <Paper className="p-4">
        <Typography>
          Welcome to your dashboard
        </Typography>
      </Paper>
    </div>
  );
} 