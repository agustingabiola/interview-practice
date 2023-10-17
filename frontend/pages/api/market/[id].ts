import {
  EOrderStatus,
  NextApiResponseWithSocket,
} from "@/features/market/domain/types";
import { NextApiRequest } from "next";
import { orders } from ".";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (req.method === "DELETE") {
    try {
      const deleteOrderId = req.query.id;

      const orderToBeCencelled = orders.find((o) => o.id === deleteOrderId);

      if (!orderToBeCencelled) {
        return res.status(204).end();
      }

      orderToBeCencelled.status = EOrderStatus.CANCELLED;

      res.socket.server.io.emit("orders-updated", orders);

      return res.status(200).json({ ok: true });
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
