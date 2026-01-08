import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
} from '@mui/material';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import GlobalLeaderBoard from './GlobalLeaderBoard';
import UserProfileDrawer from './UserProfileDrawer';

const Header: React.FC = () => {
  const nav = useNavigate()
  const [isLeaderboardOpen, setLeaderboardOpen] = useState(false);
  const [isUserOpen, setUserOpen] = useState(false);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {/* Title */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => nav('/')}>
            Stopping Game
          </Typography>

          {/* Leaderboard Button */}
          <IconButton
            color="inherit"
            onClick={() => setLeaderboardOpen(true)}
            aria-label="Leaderboard"
          >
            <LeaderboardIcon />
          </IconButton>

          {/* User Info Button */}
          <IconButton
            color="inherit"
            onClick={() => setUserOpen(true)}
            aria-label="User Info"
          >
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Leaderboard Drawer */}
      <Drawer
        anchor="right"
        open={isLeaderboardOpen}
        onClose={() => setLeaderboardOpen(false)}
      >
        <GlobalLeaderBoard />
      </Drawer>

      {/* User Info Drawer */}
      <Drawer
        anchor="right"
        open={isUserOpen}
        onClose={() => setUserOpen(false)}
      >
        <UserProfileDrawer />
      </Drawer>
    </>
  );
};

export default Header;
