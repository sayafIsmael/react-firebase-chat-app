import "@/styles/App.scss";
import "@/styles/globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AuthContextProvider } from "../context/AuthContext";
import { ChatContextProvider } from "../context/ChatContext";
import { SearchContextProvider } from "../context/SearchContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <ChatContextProvider>
        <SearchContextProvider>
          <Component {...pageProps} />
          <ToastContainer
            autoClose={2000}
            position={toast.POSITION.TOP_CENTER}
            hideProgressBar={true}
          />
        </SearchContextProvider>
      </ChatContextProvider>
    </AuthContextProvider>
  );
}
