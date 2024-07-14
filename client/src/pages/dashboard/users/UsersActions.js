import { Box, CircularProgress, Fab } from '@mui/material';
import { useEffect, useState } from 'react';
import { Check, Save } from '@mui/icons-material';
import { green } from '@mui/material/colors';
import { getUsers, updateStatus } from '../../../actions/user';
import { useValue } from '../../../context/ContextProvider';

const UsersActions = ({ params, rowId, setRowId }) => {
  const {
    dispatch,
    state: { currentUser, users },
  } = useValue();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    const { role, active, _id } = params.row;
    try {
      const result = await updateStatus({ role, active }, _id, dispatch, currentUser);
      if (result) {
        setSuccess(true);
        setRowId(null);
        const updatedUsers = users.map(user => user._id === _id ? { ...user, role, active } : user);
        dispatch({ type: 'SET_USERS', payload: updatedUsers });
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (rowId === params.id && success) {
      setSuccess(false);
    }
  }, [rowId, params.id, success]);

  // Assuming this function is part of the parent component managing the grid
  const handleRowSelect = (selectedRowId) => {
    setRowId(selectedRowId);
  };

  return (
    <Box
      sx={{
        m: 1,
        position: 'relative',
      }}
    >
      {success ? (
        <Fab
          color="primary"
          sx={{
            width: 40,
            height: 40,
            bgcolor: green[500],
            '&:hover': { bgcolor: green[700] },
          }}
        >
          <Check />
        </Fab>
      ) : (
        <Fab
  color="primary"
  sx={{ width: 40, height: 40 }}
  disabled={rowId === null || rowId !== params.id || loading}
  onClick={handleSubmit}
>
  <Save />
</Fab>

      )}
      {loading && (
        <CircularProgress
          size={52}
          sx={{
            color: green[500],
            position: 'absolute',
            top: -6,
            left: -6,
            zIndex: 1,
          }}
        />
      )}
    </Box>
  );
};

export default UsersActions;