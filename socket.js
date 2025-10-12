
const teacherModel=require("./db/teacerScheama")
const studentModel=require("./db/studenSchema")
const chatModel=require("./db/Chats")



const Socket = async (Io) => {
  Io.on("connection", async (socket) => {
    const { userId, role } = socket.handshake.auth ?? {};
    console.log(`[socket] connected: ${socket.id}, userId=${userId}, role=${role}`);

    // Update online status (your existing code)
    try {
      if (role === "student") {
        await studentModel.findByIdAndUpdate(userId, { socketId: socket.id, online: true });
      } else if (role === "teacher") {
        await teacherModel.findByIdAndUpdate(userId, { socketId: socket.id, online: true });
      }
    } catch (e) {
      console.error('[socket] error updating online status', e);
    }

    socket.on("disconnect", async () => {
      console.log(`[socket] disconnect: ${socket.id}`);
      try {
        if (role === "student") {
          await studentModel.findByIdAndUpdate(userId, { socketId: null, online: false });
        } else if (role === "teacher") {
          await teacherModel.findByIdAndUpdate(userId, { socketId: null, online: false });
        }
      } catch (e) {
        console.error('[socket] error clearing online status', e);
      }}
    )


    socket.on("sendMessage", async (payload) => {
      try {
        const {
          senderUserId,
          senderSocketId,
          receiverUserId,
          receiverSocketId,
          chatId,
          message,
          type,
          userRole,
        } = payload;

        // DB update
        await chatModel.findByIdAndUpdate(chatId, {
          $push: {
            messages: {
              sender: senderUserId,
              type,
              text: message,
            },
          },
        });

        // If receiver socket is connected, send directly, otherwise use DB-stored socketId
        if (receiverSocketId && Io.sockets.sockets.has(receiverSocketId)) {
          Io.to(receiverSocketId).emit("receiveMessage", {
            senderSocketId,
            newChat: {
              sender: senderUserId,
              type,
              text: message,
              createdAt: new Date().toISOString(),
            },
          });
        } else {
          const user = userRole === "student"
            ? await studentModel.findById(receiverUserId)
            : await teacherModel.findById(receiverUserId);

          if (user && user.socketId) {
            Io.to(user.socketId).emit("receiveMessage", {
              senderSocketId,
              newChat: {
                sender: senderUserId,
                type,
                text: message,
                createdAt: new Date().toISOString(),
              },
            });
          }
        }
      } catch (e) {
        console.error('[sendMessage] error', e);
      }
    });

  }); // end connection
};

module.exports = Socket;
