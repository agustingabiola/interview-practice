import { NextApiRequest } from "next";
import { randomUUID } from "crypto";
import {
  EOrderStatus,
  EOrderType,
  IOrder,
  NextApiResponseWithSocket,
} from "@/features/market/domain/types";

export let orders: IOrder[] = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (req.method === "GET") {
    try {
      return res.status(200).json({ orders });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        error: e.toString(),
      });
    }
  } else if (req.method === "POST") {
    try {
      const newOrder: IOrder = { ...req.body, id: randomUUID() };

      // Check if we can fulfill orders
      const updatedOrders = orders.map((o) => {
        if (
          o.status === EOrderStatus.OPEN &&
          o.symbol === newOrder.symbol &&
          o.type !== newOrder.type &&
          ((o.type === EOrderType.BUY && o.price <= newOrder.price) ||
            (o.type === EOrderType.SELL && o.price >= newOrder.price))
        ) {
          let updatedQuantity: number;

          if (o.quantity > newOrder.quantity) {
            updatedQuantity = o.quantity - newOrder.quantity;
            newOrder.quantity = 0;
            newOrder.status = EOrderStatus.FULFILLED;
          } else {
            updatedQuantity = 0;
            newOrder.quantity = newOrder.quantity - o.quantity;
          }

          return {
            ...o,
            quantity: updatedQuantity,
            status:
              updatedQuantity > 0 ? EOrderStatus.OPEN : EOrderStatus.FULFILLED,
          };
        }

        return o;
      });

      updatedOrders.push(newOrder);

      orders = updatedOrders;

      res.socket.server.io.emit("orders-updated", updatedOrders);

      return res.status(200).json({ message: "New order added" });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        error: e.toString(),
      });
    }
  } else {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
