import Head from "next/head";
import React, { useContext } from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import Auth from "../utils/Auth";
import MainLayout from "@/layouts/MainLayout";

function Boards() {
  return (
    <MainLayout>
      <Head>
        <title>Create Next App | Boards</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        
      </div>
    </MainLayout>
  );
}

export default Auth(Boards);
