// import { useOnce } from "@/app/hooks/use-once";
// import { createRaf } from "@/app/hooks/use-raf";
// import { useStdoutDimensions } from "@/app/hooks/use-stdout-dimentions";
// import { asciify } from "@/app/lib/asciify";
// import { Box, Text, useInput } from "ink";

// import { useMemo, useState } from "react";
// import * as THREE from "three";

// const Scene = () => {
//   const [src, setSrc] = useState<string | null>(null);

//   useInput((_input, key) => {
//     if (key.escape) {
//       process.exit();
//     }
//   });

//   const sizeRef = useMemo(() => ({ width: 10, height: 10 }), []);

//   const renderer = useMemo(
//     () => new THREE.WebGLRenderer({ canvas, antialias: true }),
//     [canvas]
//   );
//   const camera = useMemo(
//     () => new THREE.PerspectiveCamera(50, 2, 0.1, 100),
//     []
//   );

//   useStdoutDimensions(([width, height]) => {
//     const realHeight = height * 2;

//     canvas.width = width;
//     canvas.height = realHeight;
//     camera.aspect = width / realHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(width, realHeight);

//     sizeRef.width = width;
//     sizeRef.height = realHeight;
//   });

//   useOnce(() => {
//     renderer.shadowMap.enabled = true;

//     const scene = new THREE.Scene();

//     const cube = new THREE.Mesh(
//       new THREE.BoxGeometry(1, 1, 1),
//       new THREE.MeshStandardMaterial({ color: 0x00ff00 })
//     );
//     cube.position.y = 1;
//     cube.castShadow = true;
//     scene.add(cube);

//     const planeGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
//     planeGeometry.rotateX(-Math.PI / 2);
//     const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
//     const plane = new THREE.Mesh(planeGeometry, planeMaterial);
//     plane.receiveShadow = true;
//     scene.add(plane);

//     const ambientLight = new THREE.AmbientLight(0x404040);
//     scene.add(ambientLight);

//     const sun = new THREE.DirectionalLight(0xffffff, 1);
//     sun.castShadow = true;
//     sun.position.set(1, 1, 1);
//     sun.target.position.set(0, 0, 0);
//     scene.add(sun);

//     camera.position.z = 3;
//     camera.position.y = 1;
//     camera.lookAt(0, 1, 0);

//     const deleteRaf = createRaf(() => {
//       // Render frame
//       cube.rotation.x += 0.01;
//       cube.rotation.y += 0.01;
//       renderer.render(scene, camera);
//       const buff = Buffer.from(canvas.toDataURL().split(",")[1], "base64");

//       // transform into ascii
//       asciify(
//         buff,
//         {
//           width: sizeRef.width,
//           height: sizeRef.height,
//           fit: "cover",
//           format: "string",
//         },
//         (err, ascii) => {
//           if (err) {
//             console.error(err);
//             return;
//           }
//           setSrc(ascii);
//         }
//       );
//     });

//     return () => {
//       deleteRaf();
//     };
//   });

//   return <Box>{src ? <Text>{src}</Text> : <Text>Starting...</Text>}</Box>;
// };

// export default Scene;
