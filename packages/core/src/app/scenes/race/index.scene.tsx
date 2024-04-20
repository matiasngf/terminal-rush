import { Box, Text, useInput } from "ink";

import { useMemo, useRef, useState } from "react";
import { useOnce } from "@/app/hooks/use-once";
import { startServer } from "./start-server";
import puppeteer, { Page } from "puppeteer";
import { useStdoutDimensions } from "@/app/hooks/use-stdout-dimentions";
import { asciify } from "@/app/lib/asciify";
import { useRaf } from "@/app/hooks/use-raf";

const Scene = () => {
  const [src, setSrc] = useState<string | null>(null);
  const sizeRef = useMemo(() => ({ width: 10, height: 10 }), []);
  const pageRef = useRef<Page | null>(null);

  useInput((_input, key) => {
    if (key.escape) {
      process.exit();
    }
  });

  useStdoutDimensions(([width, height]) => {
    // Since characters all two times taller, the rendered height should be doubled
    const realHeight = height * 2;

    sizeRef.width = width;
    sizeRef.height = realHeight;

    const aspect = sizeRef.width / sizeRef.height;

    pageRef.current?.setViewport({
      width: Math.floor(aspect * 800),
      height: 800,
    });
  });

  useOnce(async () => {
    // start server
    const [_server, port] = await startServer(4001);
    // navigate to page
    const browser = await puppeteer.launch({});
    const page = await browser.newPage();

    await page.goto(`http://localhost:${port}/game`, {
      waitUntil: "networkidle2",
    });
    await page.waitForSelector("canvas");
    // Wait for bridge to be ready
    await page.waitForFunction('typeof window.connector !== "undefined"');
    const aspect = sizeRef.width / sizeRef.height;

    page.setViewport({
      width: Math.floor(aspect * 800),
      height: 800,
    });

    // page loaded
    pageRef.current = page;
  });

  useRaf(async () => {
    if (!pageRef.current) return;
    const buff = await pageRef.current.screenshot();

    const ascii = await asciify(buff, {
      width: sizeRef.width,
      height: sizeRef.height,
      fit: "cover",
      format: "string",
    });

    setSrc(ascii);
  });

  return <Box>{src ? <Text>{src}</Text> : <Text>Starting...</Text>}</Box>;
};

export default Scene;
