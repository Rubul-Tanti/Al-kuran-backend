const teacherModel = require("./db/teacerScheama");
const studentModel = require("./db/studenSchema");
const chatModel = require("./db/Chats");

let vid = [];
let activeRooms = new Map(); // roomId -> { participants: [] }

const Socket = async (Io) => {
  Io.on("connection", async (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    
    const { userId, role, roomId } = socket.handshake.auth;
    
    if (!userId || !role) {
      socket.emit("error", { message: "Authentication required" });
      return;
    }

    // Update user online status based on your existing logic
    if (role === "student") {
      const student = await studentModel.findByIdAndUpdate(userId, {
        socketId: socket.id,
        online: true
      });
    } else if (role === "teacher") {
      const teacher = await teacherModel.findByIdAndUpdate(userId, {
        socketId: socket.id,
        online: true
      });
    }

    // Store user info on socket
    socket.userId = userId;
    socket.userRole = role;
    socket.roomId = roomId;

    // Join room for video call
    if (roomId) {
      socket.join(roomId);
      
      // Initialize room if doesn't exist
      if (!activeRooms.has(roomId)) {
        activeRooms.set(roomId, { participants: [] });
      }
      
      const room = activeRooms.get(roomId);
      
      // Check room capacity (max 2 for video call)
      if (room.participants.length >= 2) {
        socket.emit("room-full", { message: "Room is full" });
        return;
      }
      
      // Add participant
      const participant = {
        userId,
        socketId: socket.id,
        role,
        video: true,
        audio: true
      };
      
      room.participants.push(participant);
      
      // Notify room about new participant
      socket.to(roomId).emit("user-joined", {
        userId,
        role,
        socketId: socket.id
      });
      
      // Send current participants to new user
      socket.emit("room-users", room.participants);
      
      console.log(`${role} ${userId} joined room ${roomId}`);
    }

    // Handle disconnect
    socket.on("disconnect", async () => {
      console.log(`Socket disconnected: ${socket.id}`);
      
      // Update user offline status based on your existing logic
      if (role === "student") {
        const student = await studentModel.findByIdAndUpdate(userId, {
          socketId: null,
          online: false
        });
      } else if (role === "teacher") {
        const teacher = await teacherModel.findByIdAndUpdate(userId, {
          socketId: null,
          online: false
        });
      }

      // Remove from active room
      if (roomId && activeRooms.has(roomId)) {
        const room = activeRooms.get(roomId);
        room.participants = room.participants.filter(p => p.socketId !== socket.id);
        
        // Notify other participant about user leaving
        socket.to(roomId).emit("user-left", {
          userId,
          socketId: socket.id
        });
        
        // Clean up empty room
        if (room.participants.length === 0) {
          activeRooms.delete(roomId);
        }
      }
    });

    // Your existing video handler
    socket.on("video", (e) => {
      console.log("video event received");
      vid.push(e);
      socket.emit("video", vid);
    });

    // WebRTC Signaling Events
    
    // Handle WebRTC offer
    socket.on("offer", async ({ to, offer }) => {
      console.log(`Offer from ${socket.id} to ${to}`);
      
      if (to) {
        // Send to specific user
        socket.to(to).emit("offer", {
          from: socket.id,
          fromUserId: userId,
          offer
        });
      } else {
        // Broadcast to room (for 2-person call)
        socket.to(roomId).emit("offer", {
          from: socket.id,
          fromUserId: userId,
          offer
        });
      }
    });

    // Handle WebRTC answer
    socket.on("answer", async ({ to, answer }) => {
      console.log(`Answer from ${socket.id} to ${to}`);
      
      if (to) {
        socket.to(to).emit("answer", {
          from: socket.id,
          fromUserId: userId,
          answer
        });
      } else {
        socket.to(roomId).emit("answer", {
          from: socket.id,
          fromUserId: userId,
          answer
        });
      }
    });

    // Handle ICE candidates
    socket.on("ice-candidate", async ({ to, candidate }) => {
      console.log(`ICE candidate from ${socket.id}`);
      
      if (to) {
        socket.to(to).emit("ice-candidate", {
          from: socket.id,
          fromUserId: userId,
          candidate
        });
      } else {
        socket.to(roomId).emit("ice-candidate", {
          from: socket.id,
          fromUserId: userId,
          candidate
        });
      }
    });

    // Handle media state changes (camera/mic toggle)
    socket.on("media-state-change", ({ video, audio }) => {
      console.log(`Media state change from ${userId}: video=${video}, audio=${audio}`);
      
      // Update participant state in room
      if (roomId && activeRooms.has(roomId)) {
        const room = activeRooms.get(roomId);
        const participant = room.participants.find(p => p.socketId === socket.id);
        if (participant) {
          participant.video = video;
          participant.audio = audio;
        }
        
        // Notify other participant
        socket.to(roomId).emit("user-media-state-changed", {
          userId,
          socketId: socket.id,
          video,
          audio
        });
      }
    });

    // Handle screen sharing
    socket.on("screen-share-start", () => {
      console.log(`Screen share started by ${userId}`);
      socket.to(roomId).emit("user-screen-share-started", {
        userId,
        socketId: socket.id
      });
    });

    socket.on("screen-share-stop", () => {
      console.log(`Screen share stopped by ${userId}`);
      socket.to(roomId).emit("user-screen-share-stopped", {
        userId,
        socketId: socket.id
      });
    });

    // Your existing chat message handler with enhancements
    socket.on("sendMessage", async ({
      senderUserId,
      senderSocketId,
      receiverUserId,
      receiverSocketId,
      chatId,
      message,
      type,
      userRole
    }) => {
      try {
        console.log("Message received:", message);
        
        // Save message to database
        const newChat = await chatModel.findByIdAndUpdate(chatId, {
          $push: {
            messages: {
              sender: senderUserId,
              type,
              text: message,
              createdAt: new Date()
            }
          }
        });

        const messageData = {
          senderSocketId,
          newChat: {
            sender: senderUserId,
            type,
            text: message,
            createdAt: new Date().toISOString()
          }
        };

        // For video call room, broadcast to room
        if (roomId) {
          socket.to(roomId).emit("receiveMessage", messageData);
        } else {
          // Your existing logic for direct messages
          if (!Io.sockets.sockets.has(receiverSocketId)) {
            const user = userRole === "student" 
              ? await studentModel.findById(receiverUserId)
              : await teacherModel.findById(receiverUserId);
            
            if (user && user.online) {
              Io.to(user.socketId).emit("receiveMessage", messageData);
            }
          } else {
            Io.to(receiverSocketId).emit("receiveMessage", messageData);
          }
        }
      } catch (e) {
        console.log("Message error:", e);
        socket.emit("message-error", { error: e.message });
      }
    });

    // Handle call actions
    socket.on("call-user", ({ targetUserId }) => {
      console.log(`Call initiated from ${userId} to ${targetUserId}`);
      
      // Find target user's socket
      const targetUser = [...activeRooms.values()]
        .flatMap(room => room.participants)
        .find(p => p.userId === targetUserId);
      
      if (targetUser) {
        socket.to(targetUser.socketId).emit("incoming-call", {
          from: userId,
          fromRole: role,
          roomId
        });
      } else {
        socket.emit("call-failed", { error: "User not available" });
      }
    });

    socket.on("accept-call", ({ callerId }) => {
      console.log(`Call accepted by ${userId} from ${callerId}`);
      socket.to(roomId).emit("call-accepted", {
        by: userId,
        byRole: role
      });
    });

    socket.on("reject-call", ({ callerId }) => {
      console.log(`Call rejected by ${userId} from ${callerId}`);
      socket.to(roomId).emit("call-rejected", {
        by: userId,
        byRole: role
      });
    });

    socket.on("end-call", () => {
      console.log(`Call ended by ${userId}`);
      socket.to(roomId).emit("call-ended", {
        by: userId,
        byRole: role
      });
    });

    // Get room info
    socket.on("get-room-info", () => {
      if (roomId && activeRooms.has(roomId)) {
        const room = activeRooms.get(roomId);
        socket.emit("room-info", {
          roomId,
          participants: room.participants,
          participantCount: room.participants.length
        });
      }
    });
  });
};

module.exports = Socket;