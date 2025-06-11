import express from "express";
import jwt from "jsonwebtoken";

import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware.js";
import {
  CreateUserSchema,
  signInSchema,
  CreateRoomSchema,
} from "@repo/common/types";

import { prismaClient } from "@repo/db/client";

const app = express();

app.post("/signup", async (req, res) => {
  const parsedData = CreateUserSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }

  await prismaClient.user.create({
    data: {
      email: parsedData.data?.username,
      password: parsedData.data?.password,
      name: parsedData.data.name,
    },
  });

  res.json({
    userId: 123,
  });
});

app.post("/signin", (req, res) => {
  const userId = 1;
  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET
  );

  res.json({
    token,
  });
});

app.post("/room", middleware, (req, res) => {
  const data = CreateRoomSchema.safeParse(req.body);

  if (!data.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }

  res.json({
    roomId: 123,
  });
});

app.listen(3001);
