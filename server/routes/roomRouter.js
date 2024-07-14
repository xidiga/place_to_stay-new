import { Router } from 'express';

import {
  createRoom,
  deleteRoom,
  getRooms,
  updateRoom,
  rentRoom  // Ensure this is imported
} from '../controllers/room.js';
import auth from '../middleware/auth.js';
import checkAccess from '../middleware/checkAccess.js';
import roomPermissions from '../middleware/permissions/room/roomPermissions.js';

const roomRouter = Router();

// Create a room
roomRouter.post('/', auth, createRoom);

// Get all rooms
roomRouter.get('/', getRooms);

// Delete a room
roomRouter.delete(
  '/:roomId',
  auth,
  checkAccess(roomPermissions.delete),
  deleteRoom
);

// Update a room
roomRouter.patch(
  '/:roomId',
  auth,
  checkAccess(roomPermissions.update),
  updateRoom
);

// Rent a room
roomRouter.post('/:roomId/rent', auth, rentRoom);

export default roomRouter;
