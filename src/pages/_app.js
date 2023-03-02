import "@/styles/App.scss";
import { AuthContextProvider } from "../context/AuthContext";
import { ChatContextProvider } from "../context/ChatContext";
import { SearchContextProvider } from "../context/SearchContext";

import "bootstrap/dist/css/bootstrap.min.css";
export default function App({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <ChatContextProvider>
        <SearchContextProvider>
          <Component {...pageProps} />
        </SearchContextProvider>
      </ChatContextProvider>
    </AuthContextProvider>
  );
}
