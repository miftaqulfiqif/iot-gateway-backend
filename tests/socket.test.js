import { io as Client } from "socket.io-client";

const URL = "http://localhost:3000";
const NUM_USERS = 10;
const EVENTS = [
  "scan",
  "start",
  "device_status",
  "choose_device",
  "sensor_data",
  "done",
];

describe("WebSocket Server - Random Sender Multi-User Isolation Test", () => {
  let sockets = [];

  beforeEach((done) => {
    let connected = 0;

    for (let i = 0; i < NUM_USERS; i++) {
      const socket = Client(URL);
      sockets.push(socket);

      socket.on("connect", () => {
        socket.emit("join", `userTest${i}`);
        connected++;
        if (connected === NUM_USERS) {
          setTimeout(done, 200);
        }
      });
    }
  });

  afterEach(() => {
    sockets.forEach((socket) => {
      if (socket.connected) socket.disconnect();
    });
    sockets = [];
  });

  EVENTS.forEach((eventName) => {
    test(`event '${eventName}' should only reach the randomly chosen sender`, (done) => {
      const senderIndex = Math.floor(Math.random() * NUM_USERS);
      const senderUserId = `userTest${senderIndex}`;
      const payload = {
        userId: senderUserId,
        test: `${eventName}-payload`,
      };

      let received = new Array(NUM_USERS).fill(false);

      sockets.forEach((socket, index) => {
        socket.on(eventName, (data) => {
          if (data.userId === `userTest${index}`) {
            received[index] = true;
          }
        });
      });

      sockets[senderIndex].emit(eventName, payload);

      setTimeout(() => {
        for (let i = 0; i < NUM_USERS; i++) {
          if (i === senderIndex) {
            expect(received[i]).toBe(true);
          } else {
            expect(received[i]).toBe(false);
          }
        }
        console.log(
          `✅ Sender userTest${senderIndex} passed on '${eventName}'`
        );
        done();
      }, 300);
    });
  });
});
