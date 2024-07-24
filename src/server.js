import { faker } from "@faker-js/faker";
import cors from "cors";
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const app = express();

app.use(cors())

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

function generateAiChat() {
  const aiMessages = []

  for (let i = 0; i < 5; i++) {
    const agentMessage = {
      agent: `Agent ${i + 1}`,
      task: faker.lorem.words(4),
      data: faker.lorem.paragraphs(3)
    }

    aiMessages.push(agentMessage);
  }

  return aiMessages
}

io.on("connection", (socket) => {
  console.log('a user connected');
  
  socket.on("executed crew", () => {
    const aiChat = generateAiChat();
    socket.emit("generate ai chat", aiChat)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
})

server.listen(3001, () => {
  console.log('server running at http://localhost:3001');
});