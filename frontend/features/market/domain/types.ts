import { NextApiResponse } from "next";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";
import type { Server as IOServer } from "socket.io";

interface ISocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

interface ISocketWithIO extends NetSocket {
  server: ISocketServer;
}

export interface NextApiResponseWithSocket extends NextApiResponse {
  socket: ISocketWithIO;
}

export enum EOrderType {
  "SELL" = "SELL",
  "BUY" = "BUY",
}

export enum EOrderStatus {
  "OPEN" = "OPEN",
  "CANCELLED" = "CANCELLED",
  "FULFILLED" = "FULFILLED",
}

export interface IOrder {
  id: string;
  ownerId: number;
  price: number;
  quantity: number;
  symbol: string;
  type: EOrderType;
  status: EOrderStatus;
}
