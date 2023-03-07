import React from "react";
import MainLayout from "@/layouts/MainLayout";
import Head from "next/head";

const index = () => {
  return (
    <MainLayout>
      <Head>
        <title>Create Next App | Boards</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>User page</div>;
    </MainLayout>
  );
};

export default index;
