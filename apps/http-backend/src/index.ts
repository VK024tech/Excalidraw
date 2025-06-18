import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors"

import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware.js";
import {
  CreateUserSchema,
  signInSchema,
  CreateRoomSchema,
} from "@repo/common/types";

import { prismaClient } from "@repo/db/client";

const app = express();
app.use(express.json());
app.use(cors())

app.post("/signup", async (req, res) => {
  const parsedData = CreateUserSchema.safeParse(req.body);

  if (!parsedData.success) {
    console.log(parsedData.error);
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(parsedData.data?.password, 10);

    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data?.username,
        password: hashedPassword,
        name: parsedData.data.name,
      },
    });
    res.json({
      userId: user.id,
    });
  } catch (error) {
    res.status(411).json({
      message: "user already exists with this username",
    });
  }
});

app.post("/signin", async (req, res) => {
  const parsedData = signInSchema.safeParse(req.body);

  if (!parsedData.success) {
    console.log(parsedData.error);
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }

  const user = await prismaClient.user.findFirst({
    where: {
      email: parsedData.data.username,
    },
  });

  if (!user) {
    res.status(403).json({
      message: "Not Authorized",
    });
    return;
  }

  const compare = await bcrypt.compare(
    parsedData.data.password,
    user?.password
  );

  if (!compare) {
    res.status(401).json({
      message: "Invalid Password",
    });
    return;
  }

  const token = jwt.sign(
    {
      userId: user?.id,
    },
    JWT_SECRET
  );

  res.json({
    token,
  });
});

app.post("/room", middleware, async (req, res) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }

  const userId = req.userId;
  if (!userId) {
    res.status(403).json({
      message: "Unauthorized",
    });
    return;
  }

  try {
    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data?.name,
        adminId: userId,
      },
    });

    res.json({
      roomId: room.id,
    });
  } catch (error) {
    res.status(411).json({
      message: "Room already exists with this name",
    });
  }
});

app.get("/chats/:roomId", async (req, res) => {
  try {
    const roomId = Number(req.params.roomId);
    console.log(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        id: "desc",
      },
      take: 1000,
    });

    res.json({
      messages,
    });
  } catch (e) {
    console.log(e);
    res.json({
      messages: [],
    });
  }
});

app.get("/room/:slug", async (req, res) => {
  const slug = req.params.slug;
  const room = await prismaClient.room.findFirst({
    where: {
      slug,
    },
  });

  res.json({
    room,
  });
});
app.listen(3001);
