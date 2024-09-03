import { useFrame } from "@react-three/fiber";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Euler,
  LineSegments,
  Matrix3,
  Matrix4,
  Quaternion,
  Vector3,
} from "three";
import { v4 } from "uuid";
import { OBB } from "three-stdlib";
import { BoxDebug } from "../debug/shape-debug";

export interface SensorInterface {
  id: string;
  active: boolean;
  position: Vector3;
  scale: Vector3;
  rotation: Euler;
  /** User data for the sensor */
  data: Record<string | number | symbol, unknown>;
  /** Used to calculate intersecitons */
  obb: OBB;
}

export type OnIntersectCallback = (sensors: SensorInterface[]) => void;

const sensorsStore: Record<string, SensorInterface> = {};

interface SensorProps {
  position?: Vector3 | [number, number, number];
  scale?: Vector3 | [number, number, number];
  rotation?: Euler | [number, number, number];
  active?: boolean;
  onIntersect?: OnIntersectCallback;
  debug?: boolean;
}

export const Sensor = forwardRef<SensorInterface, SensorProps>(function Sensor(
  {
    position = [0, 0, 0],
    scale = [1, 1, 1],
    rotation = [0, 0, 0],
    active = true,
    onIntersect,
    debug,
  },
  ref
) {
  const sensor = useMemo(() => {
    const positionVec =
      position instanceof Vector3 ? position : new Vector3(...position);
    const scaleVec = scale instanceof Vector3 ? scale : new Vector3(...scale);
    const rotationEuler =
      rotation instanceof Euler ? rotation : new Euler(...rotation);

    const obb = new OBB(
      positionVec,
      scaleVec,
      new Matrix3().setFromMatrix4(
        new Matrix4().makeRotationFromEuler(rotationEuler)
      )
    );

    const newSensor: SensorInterface = {
      id: v4(),
      active,
      position: positionVec,
      scale: scaleVec,
      rotation: rotationEuler,
      data: {},
      obb,
    };

    return newSensor;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React to active state
  useEffect(() => {
    sensor.active = active;
  }, [active, sensor]);

  // Update the ref
  useImperativeHandle(ref, () => sensor);

  const debugRef = useRef<LineSegments | null>(null);

  // Remove sensor from store on unmount
  useEffect(() => {
    return () => {
      delete sensorsStore[sensor.id];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const vRefs = useRef({
    started: false,
    quaterion: new Quaternion(),
    rotationMatrix4: new Matrix4(),
    rotationMatrix: new Matrix3().identity(),
  });

  const [started, setStarted] = useState(false);

  /**
   * Each sensor will test iself on each frame
   * Not the most performant thing, but I only have one with callbacks
   */
  useFrame(() => {
    if (!active) return;

    //update rotation matrix
    // vRefs.current.rotationMatrix4.makeRotationFromEuler(sensor.rotation);
    // vRefs.current.rotationMatrix.setFromMatrix4(vRefs.current.rotationMatrix4);

    sensor.obb.set(sensor.position, sensor.scale, vRefs.current.rotationMatrix);
    sensor.obb.rotation.setFromMatrix4(vRefs.current.rotationMatrix4);

    if (debug && debugRef.current) {
      debugRef.current.position.copy(sensor.obb.center);
      debugRef.current.scale.copy(sensor.scale);
      debugRef.current.rotation.copy(sensor.rotation);
    }

    if (!vRefs.current.started) {
      vRefs.current.started = true;
      sensorsStore[sensor.id] = sensor;
      setStarted(true);
      return;
    }

    if (!onIntersect || !started) return;

    const intersectedSensors = Object.values(sensorsStore).filter((toTest) => {
      if (!toTest.active) return false;
      if (toTest.id === sensor.id) return false;
      return sensor.obb.intersectsOBB(toTest.obb);
    });

    if (intersectedSensors.length) {
      onIntersect(intersectedSensors);
    }
  });

  if (debug && active) {
    return (
      <BoxDebug
        position={sensor.position}
        scale={sensor.scale}
        rotation={sensor.rotation}
        ref={debugRef}
      />
    );
  }

  return null;
});
