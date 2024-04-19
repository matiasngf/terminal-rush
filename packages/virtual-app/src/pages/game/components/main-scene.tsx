import { Physics } from "@react-three/cannon";
import Car from "./car/car";
import { Track } from "./track";
import { useKeyControls } from "../lib/use-controls";

export const MainScene = () => {
  useKeyControls();
  return (
    <>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Physics
        broadphase="SAP"
        defaultContactMaterial={{
          contactEquationRelaxation: 4,
          friction: 1e-3,
        }}
        allowSleep
      >
        <Track rotation={[-Math.PI / 2, 0, 0]} userData={{ id: "floor" }} />
        <Car
          position={[0, 2, 0]}
          rotation={[0, -Math.PI / 4, 0]}
          angularVelocity={[0, 0.5, 0]}
        />
      </Physics>
    </>
  );
};
