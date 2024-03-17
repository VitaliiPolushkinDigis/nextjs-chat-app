import { Box } from "@mui/material";
import { FC } from "react";

import { Canvas } from "@react-three/fiber";
import { Environment, Center } from "@react-three/drei";
import Backdrop from "./Backdrop";
import CameraRig from "./CameraRig";
import Shirt from "./Shirt";

interface Props {}

const CanvasModel: FC<Props> = () => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 0], fov: 35 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <ambientLight intensity={0.5} />
      <Environment preset="city" />

      <CameraRig>
        <Backdrop />
        <Center>
          <Shirt />
        </Center>
      </CameraRig>
    </Canvas>
  );
};

export default CanvasModel;
