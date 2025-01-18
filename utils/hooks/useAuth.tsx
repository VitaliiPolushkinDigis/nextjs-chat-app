import { useApi } from "@/utils/api";
import { AuthContext } from "@/utils/context/AuthContext";
import { useContext, useEffect, useState } from "react";

export const useAuth = () => {
  const { updateUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  console.log("loading", loading);

  const controller = new AbortController();

  useEffect(() => {
    console.log("---------hoooook");

    useApi.status().then((data) => {
      updateUser(data);
      setLoading(false);
    });
    return () => {
      controller.abort();
    };
  }, []);

  return { loading };
};
