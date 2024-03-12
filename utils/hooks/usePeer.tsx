import { useEffect, useState } from "react";

const usePeer = () => {
  const [peer, setPeer] = useState<any>();
  const [myId, setMyId] = useState<any>();

  useEffect(() => {
    (async function initPeer() {
      const myPeer = new (await import("peerjs")).default();
      setPeer(myPeer);

      myPeer.on("open", (id) => {
        setMyId(id);
      });
    })();
  }, []);

  return { peer, myId };
};

export default usePeer;
