const io = require("socket.io")();
const socketApi = {
  io: io,
};

io.on("connection", (socket) => {
  console.log("User Connected to Socket!");
  socket.on('echo', function (data) {
    io.emit('message', data);
 });
});

module.exports = { socketApi, io };
