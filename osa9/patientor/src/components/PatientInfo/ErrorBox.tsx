import React from 'react';
import { Box, Typography } from '@mui/material';

interface ErrorBoxProps {
  errorMessage: string;
}

const ErrorBox: React.FC<ErrorBoxProps> = ({ errorMessage }) => {
  return (
    <Box
      sx={{
        border: '1px solid red',
        backgroundColor: '#ffebeb',
        padding: '16px',
        borderRadius: '4px',
        margin: '16px 0'
      }}
    >
      <Typography
        variant="body1"
        sx={{
          color: 'red',
          fontWeight: 'bold'
        }}
      >
        {errorMessage}
      </Typography>
    </Box>
  );
};

export default ErrorBox;
