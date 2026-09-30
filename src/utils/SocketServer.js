const Message = require("../models/DS/message.model");
const Conversation = require("../models/DS/conversion.model");

// In-memory mapping of online users: userId -> Set(socketId)
const onlineUsers = new Map();

function SocketServer(socket, io) {
    // 1. User Online Registration
    socket.on("register_user_online", (userId) => {
        if (!userId) return;

        socket.userId = userId;
        socket.join(userId);

        if (!onlineUsers.has(userId)) {
            onlineUsers.set(userId, new Set());
        }
        onlineUsers.get(userId).add(socket.id);

        // Broadcast online status
        io.emit("user_status", {
            userId,
            isOnline: true,
            onlineUsers: Array.from(onlineUsers.keys()),
        });
    });

    // 2. Send Real-time Message via Socket
    socket.on("send_message", async ({ receiverId, text }) => {
        try {
            io.to(receiverId).emit("receive_message", text);
        } catch (err) {
            console.error("Socket send_message error:", err);
            socket.emit("error", { message: "Failed to send message" });
        }
    });

    // 3. Typing Indicator
    socket.on("typing", (receiverId) => {
        io.to(receiverId).emit("typing");
    });

    socket.on("stop_typing", (receiverId) => {
        io.to(receiverId).emit("stop-typing");
    });

    // 4. Mark as Read via Socket
    socket.on("mark_read", async ({ convoId, receiverId }) => {
        io.to(receiverId).emit("mark_read", convoId);
    });

    // 5. Message Deletion Broadcast
    socket.on("message_deleted", ({ recieverId, messageId }) => {
        io.to(recieverId).emit("message_deleted", { messageId });
    });

    // 6. Disconnect
    socket.on("disconnect", () => {
        const userId = socket.userId;
        if (userId && onlineUsers.has(userId)) {
            const userSockets = onlineUsers.get(userId);
            userSockets.delete(socket.id);

            if (userSockets.size === 0) {
                onlineUsers.delete(userId);
                io.emit("user_status", {
                    userId,
                    isOnline: false,
                    onlineUsers: Array.from(onlineUsers.keys()),
                });
            }
        }
        console.log(`User disconnected: ${socket.id}`);
    });
}

module.exports = SocketServer;
