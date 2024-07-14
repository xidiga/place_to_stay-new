import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Delete, Edit, Preview, Print as PrintIcon } from '@mui/icons-material';
import { useValue } from '../../../context/ContextProvider';
import { deleteRoom } from '../../../actions/room';
import { useNavigate } from 'react-router-dom';

const RoomsActions = ({ params }) => {
  const { _id, lng, lat, price, title, description, images, uid, userEmail, isBooked } = params.row;
  const {
    dispatch,
    state: { currentUser },
  } = useValue();

  const navigate = useNavigate();

  const handleEdit = () => {
    dispatch({ type: 'UPDATE_LOCATION', payload: { lng, lat } });
    dispatch({ type: 'UPDATE_DETAILS', payload: { price, title, description } });
    dispatch({ type: 'UPDATE_IMAGES', payload: images });
    dispatch({ type: 'UPDATE_UPDATED_ROOM', payload: { _id, uid } });
    dispatch({ type: 'UPDATE_SECTION', payload: 2 });
    navigate('/');
  };

  const printReport = () => {
    const printWindow = window.open('', '_blank', 'width=600,height=400');
    printWindow.document.write(`<html><head><title>Print Report</title></head><body>`);
    printWindow.document.write(`<h1>Room Details:</h1>`);
    printWindow.document.write(`<p>Title: ${title}</p>`);
    printWindow.document.write(`<p>Description: ${description}</p>`);
    printWindow.document.write(`<p>Price: $${price}</p>`);
    printWindow.document.write(`<h1>User Details:</h1>`);
    printWindow.document.write(`<p>Email: ${userEmail}</p>`);
    printWindow.document.write(`</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 1000); // Delay printing until the page has loaded
  };

  return (
    <Box>
      <Tooltip title="View room details">
        <IconButton onClick={() => dispatch({ type: 'UPDATE_ROOM', payload: params.row })}>
          <Preview />
        </IconButton>
      </Tooltip>
      {currentUser.role !== 'admin' && (
        <Tooltip title="Edit this room">
          <IconButton onClick={handleEdit}>
            <Edit />
          </IconButton>
        </Tooltip>
      )}
      {currentUser.role === 'admin' && (
        <>
          <Tooltip title="Delete this room">
            <IconButton onClick={() => deleteRoom(params.row, currentUser, dispatch)}>
              <Delete />
            </IconButton>
          </Tooltip>
          {/* Conditionally render the print button based on isBooked */}
          {isBooked && (
            <Tooltip title="Print booking report">
              <IconButton onClick={printReport}>
                <PrintIcon />
              </IconButton>
            </Tooltip>
          )}
        </>
      )}
    </Box>
  );
};

export default RoomsActions;
