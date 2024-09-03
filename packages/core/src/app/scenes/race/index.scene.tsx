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

  const loseCallback = useCallback(() => {
    process.exit();
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
    const abortController = new AbortController();
    const { signal } = abortController;

    let callbackId: string | null = null;
    // await pageState.evaluate(() => {
    //   (window as any).loseCallback = undefined;
    // });

    // loseCallback();

    pageState.exposeFunction("loseCallback", loseCallback);

    pageState
      .evaluate(() => {
        return window.connector
          .getState()
          .onLose.addCallback((window as any).loseCallback);
      })
      .then((cId) => {
        if (signal.aborted) return;
        callbackId = cId;
      });

    return () => {
      abortController.abort();
      if (!callbackId) return;
      pageState.evaluate((id) => {
        window.connector.getState().onLose.removeCallback(id);
        // (window as any).loseCallback = undefined;
      }, callbackId);
    };
  }, [loseCallback, pageState]);

  return (
    <Box>
      {src ? (
        <Box display="flex" flexDirection="column">
          <Text>{src}</Text>
          <Text bold color="cyan">
            Use arrows to move
          </Text>
        </Box>
      ) : (
        <Text>Starting...</Text>
      )}
    </Box>
  );
};

export default Scene;
