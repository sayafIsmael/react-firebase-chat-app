import Head from "next/head";
import React, { useContext } from "react";
import Auth from "../utils/Auth";
import MainLayout from "@/layouts/MainLayout";
import { styled } from '@mui/material/styles';
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function Boards() {
  return (
    <MainLayout>
      <Head>
        <title>Create Next App | Boards</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="page-content">
        <h1>Board</h1>
        <Box sx={{ flexGrow: 1, py: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={3} className="cursor-pointer">
              <Item>
                <img className="w-100 bg-cover" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPo5cYEYSRoBpWPGG392Wv06VF0f9GVGnyg-rJ4upM&s"/>
                <h4>Board Name</h4>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, nemo? Minus impedit aut amet quidem qui, necessitatibus nemo. Ex ipsum quae repellendus velit aut eligendi deserunt reiciendis facere beatae recusandae!</p>
              </Item>
            </Grid>
            <Grid item xs={3} className="cursor-pointer">
              <Item>
                <img className="w-100 bg-cover" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPo5cYEYSRoBpWPGG392Wv06VF0f9GVGnyg-rJ4upM&s"/>
                <h4>Board Name</h4>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, nemo? Minus impedit aut amet quidem qui, necessitatibus nemo. Ex ipsum quae repellendus velit aut eligendi deserunt reiciendis facere beatae recusandae!</p>
              </Item>
            </Grid>
            <Grid item xs={3} className="cursor-pointer">
              <Item>
                <img className="w-100 bg-cover" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPo5cYEYSRoBpWPGG392Wv06VF0f9GVGnyg-rJ4upM&s"/>
                <h4>Board Name</h4>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, nemo? Minus impedit aut amet quidem qui, necessitatibus nemo. Ex ipsum quae repellendus velit aut eligendi deserunt reiciendis facere beatae recusandae!</p>
              </Item>
            </Grid>
            <Grid item xs={3} className="cursor-pointer">
              <Item>
                <img className="w-100 bg-cover" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPo5cYEYSRoBpWPGG392Wv06VF0f9GVGnyg-rJ4upM&s"/>
                <h4>Board Name</h4>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, nemo? Minus impedit aut amet quidem qui, necessitatibus nemo. Ex ipsum quae repellendus velit aut eligendi deserunt reiciendis facere beatae recusandae!</p>
              </Item>
            </Grid>
          </Grid>
        </Box>
      </div>
    </MainLayout>
  );
}

export default Auth(Boards);
