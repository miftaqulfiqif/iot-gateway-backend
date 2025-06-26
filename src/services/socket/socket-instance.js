let io;

export const setSocketIO = (ioInstance) => {
  io = ioInstance;
};

export const getSocketIO = () => {
  if (!io) {
    throw new Error("SocketIO instance not set");
  }
  return io;
};
