import Head from "next/head";
import React, { useContext, useState, useCallback, useEffect } from "react";
import Auth from "@/utils/Auth";
import MainLayout from "@/layouts/MainLayout";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { useRouter } from "next/router";
import { getAllBoards, createBoard } from "@/services/boards.service";
import { AuthContext } from "@/context/AuthContext";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function Boards() {
  const router = useRouter();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllBoards((documents) => {
      setBoards(documents);
    });
  }, []);

  return (
    <MainLayout>
      <Head>
        <title>Create Next App | Leaderboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="page-content">
        <h1>Leaderboard</h1>
        <Box sx={{ flexGrow: 1, py: 2 }}>
          <Grid container spacing={2}>
            {[...boards].map((item, i) => (
              <Grid item xs={3} key={item.id}>
                <Item
                  className="cursor-pointer flex justify-center flex-col"
                  onClick={() => router.push(`/leaderboard/${item.id}`)}
                >
                  <img
                    className="h-44 w-auto bg-cover mb-2"
                    src={item.thumbnail}
                    style={{ height: 200 }}
                  />
                  <h4>{item.name}</h4>
                  <p>
                    {item.description.substr(0, 50) +
                      (item.description.length > 50 ? "..." : "")}
                  </p>
                  {/* <p>User reviews: {item.reviews.length}</p> */}
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>
    </MainLayout>
  );
}

export default Auth(Boards);
