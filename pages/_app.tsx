import "../styles/globals.css";

import type { AppProps } from "next/app";
import Providers from "providers/Providers";
import { Toaster } from "react-hot-toast";
import { RecoilRoot } from "recoil";

import CartDrawer from "@/components/CartDwarer";
import Layout from "@/components/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Providers>
        <Layout>
          <Toaster />
          <Component {...pageProps} />
          <CartDrawer />
        </Layout>
      </Providers>
    </RecoilRoot>
  );
}

export default MyApp;
