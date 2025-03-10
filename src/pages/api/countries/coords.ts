import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

// Next.js API route docs: https://nextjs.org/docs/api-routes/introduction

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  // set application/json as content type
  res.setHeader("Content-Type", "application/json");

  const stream = fs.createReadStream(
    path.join(__dirname, "../../../../../public/countries_coords.json"),
  );

  stream.pipe(res);
}

export const config = {
  api: {
    responseLimit: false,
  },
};
