const dotenv = require("dotenv");
const {
  AccessToken,
  RoomServiceClient,
  RoomParticipantPermission,
} = require("livekit-server-sdk");

dotenv.config();

const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;
const livekitHost = process.env.LIVEKIT_URL;

const roomService = new RoomServiceClient(livekitHost, apiKey, apiSecret);

// Generate join token
exports.generateToken = async (req, res) => {
  try {
    const { identity, roomName } = req.body;
    if (!identity || !roomName) {
      return res.status(400).json({ message: "identity and roomName required" });
    }

    const at = new AccessToken(apiKey, apiSecret, { identity });
    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });

    const token =await at.toJwt();
    res.json({ token, url: livekitHost });
  } catch (err) {
    console.error("Token Error:", err);
    res.status(500).json({ message: "Failed to generate token" });
  }
};

// List active rooms
exports.listRooms = async (req, res) => {
  try {
    const rooms = await roomService.listRooms();
    res.json(rooms);
  } catch (err) {
    console.error("List Error:", err);
    res.status(500).json({ message: "Failed to list rooms" });
  }
};

// Remove participant
exports.removeParticipant = async (req, res) => {
  try {
    const { roomName, identity } = req.body;
    await roomService.removeParticipant(roomName, identity);
    res.json({ message: `${identity} removed from ${roomName}` });
  } catch (err) {
    console.error("Remove Error:", err);
    res.status(500).json({ message: "Failed to remove participant" });
  }
};

// End room
exports.endRoom = async (req, res) => {
  try {
    const { roomName } = req.body;
    await roomService.deleteRoom(roomName);
    res.json({ message: `${roomName} ended successfully` });
  } catch (err) {
    console.error("End Room Error:", err);
    res.status(500).json({ message: "Failed to end room" });
  }
};
