import React, { useContext, useState, useCallback, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Slider from "react-slick";
import Modal from "@mui/material/Modal";
import { modalStyle } from "@/styles/mui";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 1000,
  dots: false,
  arrows: true,
  pauseOnHover: false,
};

const Set = ({ item, showPoint, showBoards, dragableButton }) => {
  const [modalopen, setModalOpen] = useState(false);
  const router = useRouter();

  const handleOpen = () => {
    setModalOpen(!modalopen);
  };
  const handleClose = () => {
    setModalOpen(!modalopen);
  };

  return (
    <Grid item xs={3} key={item.id} onClick={handleOpen}>
      <Item className="cursor-pointer flex justify-center flex-col">
        {dragableButton}
        {item.images && (
          <img className="h-44 w-auto" src={item?.images[0]?.downloadURL} />
        )}
        {item?.video && (
          <video width="640" height="360" controls className="h-44 w-auto">
            <source src={item?.video.downloadURL} type="video/mp4" />
            <source src={item?.video.downloadURL} type="video/webm" />
            <source src={item?.video.downloadURL} type="video/avi" />
          </video>
        )}
        <h4 className="text-black my-2">{item.name}</h4>
        <p>{item.description}</p>
        {item?.point > 0 && showPoint && (
          <p className="flex justify-center">
            <b>Point: </b>
            <span>{item.point}</span>
          </p>
        )}
        {showBoards && (
          <div className="flex justify-center gap-2">
            {item.boards.map((board, i) => (
              <span
                onClick={() => router.push(`/user/boards/${board.id}`)}
                className="bg-gray-200 p-2 rounded"
                key={i}
              >
                {board.name}
              </span>
            ))}
          </div>
        )}
      </Item>
      <Modal
        open={modalopen}
        onClose={handleClose}
        aria-labelledby={"modal-modal-title"}
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <div className="mb-2">
            {item?.images && (
              <Slider {...sliderSettings}>
                {item?.images.map((image, i) => (
                  <img
                    key={i}
                    src={image.downloadURL}
                    className="h-44 w-auto"
                  />
                ))}
              </Slider>
            )}
            {item.video && (
              <video width="640" height="360" controls className="h-44 w-auto">
                <source src={item?.video.downloadURL} type="video/mp4" />
                <source src={item?.video.downloadURL} type="video/webm" />
                <source src={item?.video.downloadURL} type="video/avi" />
              </video>
            )}
            <p className="mb-2 text-center text-xl">{item?.name}</p>
            <p className="mb-2 text-center">{item?.description}</p>
          </div>
          <Button variant="contained" className="w-100" onClick={handleClose}>
            Close
          </Button>
        </Box>
      </Modal>
    </Grid>
  );
};

export default Set;
