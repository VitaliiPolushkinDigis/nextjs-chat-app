import { useSnapshot } from "valtio";
import state from "../store";
import { motion, AnimatePresence } from "framer-motion";
import {
  slideAnimation,
  headContainerAnimation,
  headContentAnimation,
  headTextAnimation,
} from "../../../utils/config/motion";

export default function Content() {
  const snap = useSnapshot(state);
  return (
    <AnimatePresence>
      {snap.intro && (
        <motion.div className="content" {...slideAnimation("left")}>
          <motion.header {...slideAnimation("down")}></motion.header>
          <motion.div {...headContainerAnimation}>
            <motion.div {...headTextAnimation}>
              <h1>Build Your Authentic Product</h1>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
