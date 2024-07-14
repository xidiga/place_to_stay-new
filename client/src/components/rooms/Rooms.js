import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Rating,
  Tooltip,
  Typography,
  Snackbar,
  Alert,
  TextField,
  Box,
  MenuItem,
  Select,
  InputLabel
} from '@mui/material';
import { useValue } from '../../context/ContextProvider';
import { StarBorder } from '@mui/icons-material';

const Rooms = () => {
  const { state: { filteredRooms }, dispatch } = useValue();
  const [open, setOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [rentalDuration, setRentalDuration] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [durationType, setDurationType] = useState('month');
  const [showDurationInput, setShowDurationInput] = useState(false);

  useEffect(() => {
    const rentedRooms = JSON.parse(localStorage.getItem('rentedRooms')) || [];
    if (rentedRooms.length > 0) {
      const updatedRooms = filteredRooms.map(room => {
        if (rentedRooms.includes(room._id)) {
          return { ...room, rented: true };
        }
        return room;
      });
      dispatch({ type: 'UPDATE_ROOMS', payload: updatedRooms });
    }
  }, [dispatch, filteredRooms]);

  const handleRent = () => {
    const updatedRooms = filteredRooms.map(room =>
      room._id === selectedRoom._id ? { ...room, rented: true } : room
    );
    dispatch({ type: 'UPDATE_ROOMS', payload: updatedRooms });

    const rentedRooms = JSON.parse(localStorage.getItem('rentedRooms')) || [];
    rentedRooms.push(selectedRoom._id);
    localStorage.setItem('rentedRooms', JSON.stringify(rentedRooms));

    printReport(selectedRoom);

    setSnackbarOpen(true);
    handleClose();
  };

  const printReport = (room) => {
    const reportContent = `Booking Report:\nRoom ID: ${room._id}\nTitle: ${room.title}\nPrice: $${room.price}\nDuration: ${rentalDuration} ${durationType}(s)`;
    console.log(reportContent);
    // Replace console.log with actual report printing logic
  };

  const handleOpen = (room) => {
    setSelectedRoom(room);
    setOpen(true);
    setShowDurationInput(false);
  };

  const handleClose = () => {
    setOpen(false);
    setShowDurationInput(false);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <ImageList
        gap={12}
        sx={{
          mb: 8,
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))!important',
        }}
      >
        {filteredRooms.map((room) => (
          <Card key={room._id} sx={{ maxHeight: 350 }}>
            <ImageListItem sx={{ height: '100% !important' }}>
              <ImageListItemBar
                sx={{
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.7)0%, rgba(0,0,0,0.3)70%, rgba(0,0,0,0)100%)',
                }}
                title={room.price === 0 ? 'Free Stay' : '$' + room.price}
                actionIcon={
                  <Tooltip title={room.uName} sx={{ mr: '5px' }}>
                    <Avatar src={room.uPhoto} />
                  </Tooltip>
                }
                position="top"
              />
              <img
                src={room.images[0]}
                alt={room.title}
                loading="lazy"
                style={{ cursor: 'pointer' }}
                onClick={() => handleOpen(room)}
              />
              <ImageListItemBar
                title={room.title}
                actionIcon={
                  <Rating
                    sx={{ color: 'rgba(255,255,255, 0.8)', mr: '5px' }}
                    name="room-rating"
                    defaultValue={3.5}
                    precision={0.5}
                    emptyIcon={<StarBorder sx={{ color: 'rgba(255,255,255, 0.8)' }} />}
                  />
                }
              />
            </ImageListItem>
          </Card>
        ))}
      </ImageList>

      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>{selectedRoom?.title}</DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center">
            {selectedRoom?.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Image ${index + 1}`}
                style={{ width: '30%', marginRight: '10px' }}
              />
            ))}
          </Box>
          <Typography variant="h6" gutterBottom>
            Price Per Night: ${selectedRoom?.price}
          </Typography>
          <Typography variant="body1">
            Details: {selectedRoom?.description}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowDurationInput(true)}
              disabled={selectedRoom?.rented}
            >
              Rental Booking
            </Button>
            {selectedRoom?.rented && (
              <Typography variant="body1" color="error">
                This room is already rented.
              </Typography>
            )}
          </Box>
          {showDurationInput && (
            <Box sx={{ mt: 2 }}>
              <InputLabel id="duration-type-label">Duration Type</InputLabel>
              <Select
                labelId="duration-type-label"
                value={durationType}
                onChange={(e) => setDurationType(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              >
                <MenuItem value="month">Month</MenuItem>
                <MenuItem value="year">Year</MenuItem>
              </Select>
              <TextField
                label={`Rental Duration (${durationType})`}
                variant="outlined"
                fullWidth
                value={rentalDuration}
                onChange={(e) => setRentalDuration(e.target.value)}
                helperText={`Enter the duration of the rental in ${durationType}(s)`}
                margin="dense"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {showDurationInput && (
            <Button onClick={handleRent} color="primary">
              Confirm Booking
            </Button>
          )}
          <Button onClick={handleClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Rental successfully booked!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Rooms;
