import { Box, Text, useInput } from "ink";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const [pageState, setPageState] = useState<Page | null>(null);

  useInput((_input, key) => {
    if (key.escape) {
      process.exit();
    }
  });

  useStdoutDimensions(([width, height]) => {
    // Since characters all two times taller, the rendered height should be doubled
    const realHeight = (height - 1) * 2;

    sizeRef.width = width;
    sizeRef.height = realHeight;

    pageRef.current?.setViewport({
      width: sizeRef.width,
      height: sizeRef.height,
    });
  });

  useOnce(async () => {
    // start server
    const [_server, port] = await startServer();
    // navigate to page
    const browser = await puppeteer.launch({});
    const page = await browser.newPage();

    await page.goto(`http://localhost:${port}/game`, {
      waitUntil: "networkidle2",
    });
    await page.waitForSelector("canvas");
    // Wait for bridge to be ready
    await page.waitForFunction('typeof window.connector !== "undefined"');

    page.setViewport({
      width: sizeRef.width,
      height: sizeRef.height,
    });

    // page loaded
    pageRef.current = page;
    setPageState(page);
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

  const [gameOver, setGameOver] = useState(false);

  const loseCallback = useCallback(() => {
    console.clear();
    setGameOver(true);
  }, []);

  useInput((_input, key) => {
    if (!pageRef.current) return;
    if (key.leftArrow) {
      pageRef.current.evaluate(() => {
        window.connector.getState().actions.left();
      });
    }
    if (key.rightArrow) {
      pageRef.current.evaluate(() => {
        window.connector.getState().actions.right();
      });
    }
  });

  // conect callback for game over

  useEffect(() => {
    if (!pageState) return;

    pageState.exposeFunction("loseCallback", loseCallback);
  }, [loseCallback, pageState]);

  useInput((input) => {
    if (!gameOver) return;
    if (input === "r") {
      setGameOver(false);
      pageRef.current.evaluate(() => {
        window.connector.getState().actions.restart();
      });
    } else {
      process.exit();
    }
  });

  return (
    <Box>
      {src ? (
        <Box display="flex" flexDirection="column">
          <Text>{src}</Text>
          {gameOver ? (
            <Text bold backgroundColor="red" color="white">
              Game over, press any key to exit, R to restart.
            </Text>
          ) : (
            <Text bold color="cyan">
              Use arrows to move
            </Text>
          )}
        </Box>
      ) : (
        <Text>Starting...</Text>
      )}
    </Box>
  );
};

export default Scene;
