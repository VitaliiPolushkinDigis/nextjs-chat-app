import { useAppDispatch } from "@/redux";
import { getAuth } from "@/redux/slices/userSlice";
import { Box, Button, Card } from "@mui/material";
import Peer from "peerjs";
import { FC, useEffect, useState } from "react";

// export const createPeerInstance = (id: string) => {
//   let peer: any;
//   if (typeof window !== "undefined") {
//     import("peerjs").then(({ default: Peer }) => {
//       if (Peer) {
//         peer = new Peer(id);
//       }
//     });

//     return peer;
//   }
//   return peer;
// };

interface PeerProps {}

const PeerPage: FC<PeerProps> = () => {
  const [id, setId] = useState("");
  const [connectedId, setConnectedId] = useState("");
  const [peer, setPeer] = useState<Peer | undefined>();

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAuth(null));
  }, [dispatch]);

  useEffect(() => {
    // if (typeof window !== "undefined") {
    //   const { Peer } = require("peerjs"); // or import Peer from 'peerjs';
    //   const peer = new Peer("id");
    //   console.log(`peer id: ${peer.id}`);
    //   //connect to other peer
    //   const connection = peer.connect("other peer id");
    //   peer.on("call", (call) => {});
    //   // rest of the useEffect code
    //   return () => {
    //     // cleanup code
    //   };
    // }
    if (typeof window !== "undefined") {
      if (peer) {
        peer.on("call", (call) => {
          call.answer(new MediaStream());
          console.log("call", call);
        });
      }
    }
  }, [peer]);

  function createPeer() {
    if (typeof window !== "undefined") {
      if (peer) {
        return console.log("peer already created");
      }
      const { Peer } = require("peerjs"); // or import Peer from 'peerjs';

      const newPeer = new Peer(id);
      setPeer(newPeer);
    }
  }

  const connectToPeer = () => {
    if (typeof window !== "undefined") {
      if (!connectedId) return console.log("no id");

      if (!peer) return console.log("no connected id");
      peer.connect(connectedId);
      peer.call(connectedId, new MediaStream());

      console.log("peer", peer);
    }
  };

  return (
    <Box component={"section"} minHeight={"100vh"}>
      {peer && peer.id}
      <Card>
        <label htmlFor="peerId">Create Peer and setId</label>
        <input
          type="text"
          id="peerId"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <Button onClick={createPeer}>Create Peer</Button>
      </Card>
      <Card>
        <label htmlFor="peerId2">Connect to Peer</label>
        <input
          type="text"
          id="peerId2"
          value={connectedId}
          onChange={(e) => setConnectedId(e.target.value)}
        />
        <Button onClick={connectToPeer}>Connect to</Button>
      </Card>
    </Box>
  );
};

export default PeerPage;
