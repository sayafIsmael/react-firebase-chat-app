import Head from "next/head";
import React, { useContext, useEffect, useState, useCallback } from "react";
import Auth from "@/utils/Auth";
import MainLayout from "@/layouts/MainLayout";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { modalStyle } from "@/styles/mui";
import { getLeaderBoardDetails } from "@/services/boards.service";
import { useRouter } from "next/router";
import Grid from "@mui/material/Grid";
import Slider from "react-slick";
import { AuthContext } from "@/context/AuthContext";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Set from "@/components/Set";

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  dots: false,
  arrows: true,
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function BoardDetails() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [board, setBoard] = useState({
    name: "",
    description: "",
    thumbnail: "",
  });
  const [sets, setSets] = useState([]);
  const { id } = router.query;

  useEffect(() => {
    setLoading(true);
    getLeaderBoardDetails(id, (documents) => {
      setSets(documents?.sets || []);
      setBoard(documents?.board);
      setLoading(false);
      console.log("board details", documents);
    });
  }, [id]);

  return (
    <MainLayout>
      <Head>
        <title>Create Next App | Leaderboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="page-content">
        <div className="flex justify-between">
          <div>
            <h4>{board.name}</h4>
            <p> {board.description}</p>
          </div>
        </div>
        <Box sx={{ flexGrow: 1, py: 2 }}>
          <Grid container spacing={2}>
            {[...sets].map((item, i) => (
              <Set key={item.id} item={item} showPoint={true} />
            ))}
          </Grid>
        </Box>
      </div>
    </MainLayout>
  );
}
