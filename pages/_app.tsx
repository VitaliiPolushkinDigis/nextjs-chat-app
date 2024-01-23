import "@/styles/globals.css";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import { AppCacheProvider } from "@mui/material-nextjs/v13-pagesRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { AppProps } from "next/app";
import { ToastProvider } from "react-toast-notifications";
import { AuthContext } from "@/utils/context/AuthContext";
import { useState } from "react";
import { User } from "@/utils/types";
import { Provider } from "react-redux";
import store, { wrapper } from "@/redux";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#764abc",
    },
  },
});

export default function App({ Component, ...rest }: AppProps) {
  const { store } = wrapper.useWrappedStore(rest);
  const [user, updateUser] = useState<User>();
  return (
    <Provider store={store}>
      <AppCacheProvider {...rest.pageProps}>
        <ThemeProvider theme={theme}>
          <AuthContext.Provider
            value={{ user, updateUser: (u: User) => updateUser(u) }}
          >
            <ToastProvider autoDismiss autoDismissTimeout={3500}>
              <CssBaseline />
              <Component {...rest.pageProps} />
            </ToastProvider>
          </AuthContext.Provider>
        </ThemeProvider>
      </AppCacheProvider>
    </Provider>
  );
}
