import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Paper,
  Divider,
  InputAdornment,
  IconButton
} from '@mui/material';
import { 
  Google as GoogleIcon,
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Lock as LockIcon
} from '@mui/icons-material';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (username === 'admin' && password === 'admin') {
      onLogin();
      navigate('/');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(145deg, #f6f8fc 0%, #f0f4f8 100%)'
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          borderRadius: 3,
          backdropFilter: 'blur(10px)',
          background: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
        }}
      >
        <Typography 
          variant="h4" 
          align="center" 
          sx={{ 
            mb: 4, 
            fontWeight: 600,
            background: 'linear-gradient(45deg, #1a1a1a, #4a4a4a)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Welcome Back
        </Typography>

        {error && (
          <Typography 
            color="error" 
            align="center" 
            sx={{ 
              mb: 2,
              p: 1.5,
              borderRadius: 1,
              bgcolor: 'error.light',
              color: 'error.dark',
              fontSize: '0.875rem'
            }}
          >
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            variant="outlined"
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: 'rgba(255, 255, 255, 0.9)'
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              )
            }}
          />

          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            variant="outlined"
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: 'rgba(255, 255, 255, 0.9)'
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Button
            type="submit"
            fullWidth
            sx={{
              py: 1.5,
              mb: 2,
              bgcolor: 'black',
              color: 'white',
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              '&:hover': {
                bgcolor: 'grey.900',
                boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
              }
            }}
          >
            Sign In
          </Button>

          <Divider sx={{ my: 3 }}>
            <Typography color="text.secondary" variant="body2">
              or continue with
            </Typography>
          </Divider>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={() => console.log('Google login')}
            sx={{
              py: 1.5,
              color: 'text.primary',
              borderColor: 'grey.300',
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              bgcolor: 'white',
              '&:hover': {
                bgcolor: 'grey.50',
                borderColor: 'grey.400'
              }
            }}
          >
            Sign in with Google
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;