import { Html, Head, Main, NextScript, DocumentContext } from "next/document";
import {
  DocumentHeadTags,
  documentGetInitialProps,
} from "@mui/material-nextjs/v13-pagesRouter";

export default function Document(props: any) {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <DocumentHeadTags {...props} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

Document.getInitialProps = async (ctx: DocumentContext) => {
  const finalProps = await documentGetInitialProps(ctx);

  return finalProps;
};
