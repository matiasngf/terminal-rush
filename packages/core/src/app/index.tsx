import { render } from "ink";
import React, { useEffect, useState } from "react";
import { useGlobalRafRunner } from "./hooks/use-raf";
import { useRouter, routes, ScenePath, navigate } from "@router";

const DefaultScene = () => <></>;

const Scene = () => {
  useGlobalRafRunner();

  const { currentScene } = useRouter();

  const [CurrentScene, SetCurrentScene] = useState(() => DefaultScene);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const sceneLoader = routes[currentScene];
    sceneLoader().then((sceneModule) => {
      if (signal.aborted) return;
      SetCurrentScene(() => sceneModule.default);
    });

    return () => {
      abortController.abort();
    };
  }, [currentScene]);

  return <CurrentScene />;
};

const App = () => {
  return (
    <React.StrictMode>
      <Scene />
    </React.StrictMode>
  );
};

export const startApp = (scene: ScenePath) => {
  navigate(scene);
  // console.clear();
  render(<App />);
};
