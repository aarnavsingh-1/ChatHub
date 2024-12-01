import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import NotificationSound from "../lib/notification.mp3";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  // Fetches users and updates the state
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // Fetches messages for the selected user
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Sends a message and updates the user list to bring the selected user to the top
  sendMessage: async (messageData) => {
    try {
      const { selectedUser, messages, users } = get();
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);

      // Update messages and move the selected user to the top of the user list
      set({
        messages: [...messages, res.data],
        users: [selectedUser, ...users.filter((user) => user._id !== selectedUser._id)],
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  // Subscribes to new messages and updates the user list dynamically
  subscribeToMessages: () => {
    const { selectedUser } = get();
    const socket = useAuthStore.getState().socket;
  
    socket.on("newMessage", (newMessage) => {
      const { users, messages } = get();
  
      // Check if the message involves the current user (sender or receiver)
      const isMessageInvolved = newMessage.senderId === selectedUser?._id || newMessage.receiverId === useAuthStore.getState().currentUser._id;
  
      // Play notification sound for incoming messages
      const sound = new Audio(NotificationSound);
      sound.play().catch((error) => console.error("Failed to play sound:", error));
  
      if (isMessageInvolved) {
        const updatedUsers = users.map((user) => {
          // Update lastMessage for both sender and receiver
          if (user._id === newMessage.senderId || user._id === newMessage.receiverId) {
            return { ...user, lastMessage: newMessage };
          }
          return user;
        });
  
        // Re-order the users list based on involvement in the message
        const involvedUser = updatedUsers.find((user) => user._id === newMessage.senderId || user._id === newMessage.receiverId);
  
        set({
          messages: [...messages, newMessage],
          users: [involvedUser, ...updatedUsers.filter((user) => user._id !== involvedUser._id)],
        });
        
      }
    });
  },
  

  // Unsubscribes from message updates
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  // Updates the selected user
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));

