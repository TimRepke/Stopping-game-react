import React, { useState, type ChangeEvent } from 'react';
import {
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Stack,
} from '@mui/material';

const UserProfileDrawer: React.FC = () => {
  // Mock initial values (later fetched from API/context)
  const initialName = 'Guest user';
  const initialEmail = '';

  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);

  // Track if changes were made
  const hasChanges = name !== initialName || email !== initialEmail;

  const handleSave = () => {
    // TODO: connect to API
    console.log('Saving user info:', { name, email });
  };

  const handleAvatarClick = () => {
    // TODO: open file picker later
    console.log('Change avatar clicked');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3} alignItems="center">
        {/* Avatar */}
        <Avatar
          sx={{
            width: 96,
            height: 96,
            cursor: 'pointer',
          }}
          onClick={handleAvatarClick}
        >
          {name.charAt(0).toUpperCase()}
        </Avatar>

        <Typography variant="body2" color="text.secondary">
          Click avatar to change
        </Typography>

        {/* Name */}
        <TextField
          label="Nickname"
          fullWidth
          value={name}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
        />

        {/* Email (optional) */}
        <TextField
          label="Email (optional)"
          type="email"
          fullWidth
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />

        {/* Save Button */}
        {hasChanges && (
          <Button
            variant="contained"
            fullWidth
            onClick={handleSave}
          >
            Save Changes
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default UserProfileDrawer;
