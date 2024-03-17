import { proxy } from "valtio";
const state: any = proxy({
  intro: true,
  color: "#EF488E",
  isLogoTexture: true,
  isFullTexture: false,
  logoDecal: "./react.png",
  fullDecal: "./react.png",
});
export default state;
