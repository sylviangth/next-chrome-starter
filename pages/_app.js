import { NextUIProvider } from "@nextui-org/react";
import "/styles/globals.css";
import Footer from '../components/Footer';
import Header from '../components/Header';

export default function App({ Component, pageProps }) {
  return (
    <main className="w-[24rem]">
      <NextUIProvider>
        {/* <Header/> */}
        <Component {...pageProps} />
        {/* <Footer /> */}
      </NextUIProvider>
    </main>
  );
}
