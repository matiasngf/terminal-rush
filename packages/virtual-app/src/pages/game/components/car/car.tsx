import type { BoxProps, WheelInfoOptions } from "@react-three/cannon";
import { useBox, useRaycastVehicle } from "@react-three/cannon";
import { useEffect, useRef } from "react";
import { Quaternion, Vector3, type Group, type Mesh } from "three";

import { Chassis } from "./chassis";
import { Wheel } from "./wheel";
import { useConnector } from "../../lib/connector";
import { useFrame, useThree } from "@react-three/fiber";

export type CarProps = Required<
  Pick<BoxProps, "angularVelocity" | "position" | "rotation">
> & {
  back?: number;
  force?: number;
  front?: number;
  height?: number;
  maxBrake?: number;
  radius?: number;
  steer?: number;
  width?: number;
};

const chasisWidth = 1.7;
const chasisHeight = 1;
const chasisFront = 2;
const chassisBodyArgs = [chasisWidth, chasisHeight, chasisFront * 2] as [
  number,
  number,
  number,
];
const LERP_VAL = 0.05;

function Car({
  angularVelocity,
  back = -1.15,
  force = 1500,
  front = 1.3,
  height = -0.04,
  maxBrake = 50,
  position,
  radius = 0.7,
  rotation,
  steer = 0.5,
  width = 1.2,
}: CarProps) {
  const wheels = [
    useRef<Group>(null),
    useRef<Group>(null),
    useRef<Group>(null),
    useRef<Group>(null),
  ];

  const controlsRef = useConnector((s) => s.controlsRef);

  const wheelInfo: WheelInfoOptions = {
    axleLocal: [-1, 0, 0], // This is inverted for asymmetrical wheel models (left v. right sided)
    customSlidingRotationalSpeed: -30,
    dampingCompression: 4.4,
    dampingRelaxation: 2.3,
    directionLocal: [0, -1, 0], // set to same as Physics Gravity
    frictionSlip: 5,
    maxSuspensionForce: 1e4,
    maxSuspensionTravel: 0.1,
    radius,
    suspensionRestLength: 0.3,
    suspensionStiffness: 60,
    useCustomSlidingRotationalSpeed: true,
  };

  const wheelInfo1: WheelInfoOptions = {
    ...wheelInfo,
    chassisConnectionPointLocal: [-width / 2, height, front],
    isFrontWheel: true,
  };
  const wheelInfo2: WheelInfoOptions = {
    ...wheelInfo,
    chassisConnectionPointLocal: [width / 2, height, front],
    isFrontWheel: true,
  };
  const wheelInfo3: WheelInfoOptions = {
    ...wheelInfo,
    chassisConnectionPointLocal: [-width / 2, height, back],
    isFrontWheel: false,
  };
  const wheelInfo4: WheelInfoOptions = {
    ...wheelInfo,
    chassisConnectionPointLocal: [width / 2, height, back],
    isFrontWheel: false,
  };

  const [chassisBody, chassisApi] = useBox(
    () => ({
      allowSleep: false,
      angularVelocity,
      args: chassisBodyArgs,
      mass: 500,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // onCollide: (e: any) => console.log("bonk", e.body.userData),
      position,
      rotation,
    }),
    useRef<Mesh>(null)
  );

  const [vehicle, vehicleApi] = useRaycastVehicle(
    () => ({
      chassisBody,
      wheelInfos: [wheelInfo1, wheelInfo2, wheelInfo3, wheelInfo4],
      wheels,
    }),
    useRef<Group>(null)
  );

  // useEffect(
  //   () => vehicleApi.sliding.subscribe((v) => console.log("sliding", v)),
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   []
  // );

  useFrame(({ gl, scene, camera }) => {
    gl.render(scene, camera);
  }, 0);

  useFrame(() => {
    const { backward, brake, forward, left, reset, right } =
      controlsRef.current;

    for (let e = 2; e < 4; e++) {
      vehicleApi.applyEngineForce(
        forward || backward ? force * (forward && !backward ? -1 : 1) : 0,
        2
      );
    }

    for (let s = 0; s < 2; s++) {
      vehicleApi.setSteeringValue(
        left || right ? steer * (left && !right ? 1 : -1) : 0,
        s
      );
    }

    for (let b = 2; b < 4; b++) {
      vehicleApi.setBrake(brake ? maxBrake : 0, b);
    }

    if (reset) {
      chassisApi.position.set(...position);
      chassisApi.velocity.set(0, 0, 0);
      chassisApi.angularVelocity.set(...angularVelocity);
      chassisApi.rotation.set(...rotation);
    }
  }, 2);

  const refs = useRef({
    carGlobalPos: new Vector3(0, 0, 0),
    cameraPosTarget: new Vector3(0, 0, 0),
    cameraPos: new Vector3(0, 0, 0),
    viewPosTarget: new Vector3(0, 0, 0),
    viewPos: new Vector3(0, 0, 0),
    carQuaterion: new Quaternion(0, 0, 0, 0),
    wDir: new Vector3(0, 0, 1),
    started: false,
  });

  const camera = useThree((s) => s.camera);

  useEffect(() => {
    const {
      viewPos,
      cameraPos,
      viewPosTarget,
      cameraPosTarget,
      carQuaterion,
      wDir,
      carGlobalPos,
    } = refs.current;

    const unsuscribe1 = chassisApi.position.subscribe((v) => {
      carGlobalPos.set(...v);
      wDir.set(0, 0.2, -1);
      wDir.applyQuaternion(carQuaterion);
      wDir.multiplyScalar(7);
      cameraPosTarget.copy(carGlobalPos);
      cameraPosTarget.add(wDir);
      cameraPosTarget.y += 0.2;
      cameraPos.lerp(cameraPosTarget, LERP_VAL);
      camera.position.copy(cameraPos);
    });
    const unsuscribe2 = chassisApi.quaternion.subscribe((v) => {
      wDir.set(0, 0.2, 10);
      wDir.applyQuaternion(carQuaterion);
      wDir.multiplyScalar(7);
      carQuaterion.set(...v);
      viewPosTarget.copy(carGlobalPos);
      viewPosTarget.add(wDir);
      viewPos.lerp(viewPosTarget, LERP_VAL);
      camera.lookAt(viewPos);
    });

    return () => {
      unsuscribe1();
      unsuscribe2();
    };
  }, [chassisApi, refs, camera]);

  return (
    <group ref={vehicle} position={[0, -0.4, 0]}>
      <Chassis ref={chassisBody} />
      <Wheel ref={wheels[0]} radius={radius} leftSide />
      <Wheel ref={wheels[1]} radius={radius} />
      <Wheel ref={wheels[2]} radius={radius} leftSide />
      <Wheel ref={wheels[3]} radius={radius} />
    </group>
  );
}

export default Car;
