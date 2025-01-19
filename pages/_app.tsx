import "@/styles/globals.css";
import { createTheme } from "@mui/material/styles";
import { AppCacheProvider } from "@mui/material-nextjs/v13-pagesRouter";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { AppProps } from "next/app";
import { ToastProvider } from "react-toast-notifications";
import { AuthContext } from "@/utils/context/AuthContext";
import { useEffect, useState } from "react";
import { User } from "@/utils/types";
import { Provider } from "react-redux";
import { wrapper } from "@/redux";
import { useApi } from "@/utils/api";
import { useRouter } from "next/navigation";

const theme = createTheme({
  palette: {
    primary: {
      main: "#378158",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});
export default function App({ Component, ...rest }: AppProps) {
  console.log("...rest", rest);

  const router = useRouter();
  const { store } = wrapper.useWrappedStore(rest);
  const [user, updateUser] = useState<User>();
  const props = { ...rest.pageProps, user };

  useEffect(() => {
    console.log("------------_app.tsx");

    useApi.status().then(
      (d) => {
        updateUser(d);
      },
      (err) => {
        console.log("err", err);
        // router.push("/login");
      }
    );
  }, []);

  return (
    <Provider store={store}>
      <AppCacheProvider {...rest.pageProps}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthContext.Provider
            value={{ user, updateUser: (u: User) => updateUser(u) }}
          >
            <ToastProvider autoDismiss autoDismissTimeout={3500}>
              <Component {...props} />
            </ToastProvider>
          </AuthContext.Provider>
        </ThemeProvider>
      </AppCacheProvider>
    </Provider>
  );
}
