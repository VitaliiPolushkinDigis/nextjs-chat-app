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

// export async function getServerSideProps(ctx) {
//   const cookies = ctx.req.headers.cookie;

//   /*  const config: AxiosRequestConfig = {
//     withCredentials: true,
//     headers: {
//       "Access-Control-Allow-Origin": "http://localhost:3000",
//       "Content-Type": "application/json",
//       Cookie: ctx.req.headers.cookie,
//     },
//   };
//   const res = await axios.get<User>(
//     `http://localhost:3001/api/auth/status`,
//     config
//   ); */

//   const res = await getAuthUser(cookies);

//   // Assuming you have an API route for status
//   const data = res.data;
//   return {
//     props: {
//       user: data,
//     },
//   };
//   try {
//   } catch (error) {
//     console.error(error);

//     // Handle errors, maybe redirect to an error page
//     return {
//       redirect: {
//         destination: "/error",
//         permanent: false,
//       },
//     };
//   }
// }
