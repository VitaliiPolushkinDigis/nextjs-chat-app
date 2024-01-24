import { useAppDispatch, useTypedSelector } from "@/redux";
import { getAuth } from "@/redux/slices/userSlice";
import { Box, Button, Card } from "@mui/material";
import Peer from "peerjs";
import { FC, FormEvent, useEffect, useState } from "react";

interface PeerProps {}

const PeerPage: FC<PeerProps> = () => {
  const [userName, setUserName] = useState("");
  const [peer, setPeer] = useState<Peer | undefined>();

  const { user } = useTypedSelector((state) => state.user);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!peer) return console.log("Effect: no peer");

    peer.on("connection", () => {
      console.log("peer connected");
    });
  }, [peer]);

  const initPeer = () => {
    if (typeof window !== "undefined") {
      if (peer) {
        return console.log("peer already created");
      }
      const { Peer } = require("peerjs"); // or import Peer from 'peerjs';

      if (user?.firstName) {
        const newPeer = new Peer(user?.firstName);
        setPeer(newPeer);
      }
    }
  };

  const connect = (e: FormEvent) => {
    e.preventDefault();

    if (!peer) return console.log("no peer");

    peer.connect(userName).on("open", () => {
      console.log("open");
    });
  };

  return (
    <Box component={"section"} minHeight={"100vh"}>
      user: {user?.firstName}
      peer: {peer && peer.id}
      <Card>
        <Button onClick={initPeer}>Init Peer</Button>
        <form onSubmit={connect}>
          <label htmlFor="userName">set name</label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <Button type="submit">Connect</Button>
        </form>
      </Card>
    </Box>
  );
};

export default PeerPage;
