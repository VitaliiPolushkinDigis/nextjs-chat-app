import { wrapper } from "@/redux";
import { getAuth } from "@/redux/slices/userSlice";
import { getAuthUser } from "@/utils/api";
import { User } from "@/utils/types";
import axios, { AxiosRequestConfig } from "axios";
import { GetServerSideProps } from "next";
import { FC } from "react";

interface TestProps {
  user: User | null;
}

const Test: FC<TestProps> = ({ user }) => {
  return <h1>{user?.firstName}</h1>;
};

export default Test;

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => async (ctx) => {
    const cookies = ctx.req.headers.cookie;
    console.log("2. Page.getServerSideProps uses the store to dispatch things");
    try {
      const user = await store.dispatch(getAuth(cookies));

      return {
        props: {
          user: user.payload,
        },
      };
    } catch (error) {
      return {
        props: {
          user: null,
        },
      };
    }
  });
