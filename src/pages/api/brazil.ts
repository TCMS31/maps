import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  // set application/json as content type
  res.setHeader("Content-Type", "application/json");

  const stream = fs.createReadStream(
    path.join(__dirname, "../../../../public/partial-brazil.json"),
  );

  stream.pipe(res);
}
