import "@/styles/App.scss";
import "@/styles/globals.css";
import { AuthContextProvider } from "../context/AuthContext";
import { ChatContextProvider } from "../context/ChatContext";
import { SearchContextProvider } from "../context/SearchContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <ChatContextProvider>
        <SearchContextProvider>
          <Component {...pageProps} />
          <ToastContainer />
        </SearchContextProvider>
      </ChatContextProvider>
    </AuthContextProvider>
  );
}
