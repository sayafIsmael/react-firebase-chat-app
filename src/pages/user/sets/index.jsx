import Head from "next/head";
import React, { useContext, useState, useCallback, useEffect } from "react";
import Auth from "@/utils/Auth";
import MainLayout from "@/layouts/MainLayout";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Modal from "@mui/material/Modal";
import { modalStyle } from "@/styles/mui";
import TextField from "@mui/material/TextField";
import { FiCamera } from "react-icons/fi";
import ReactFileReader from "react-file-reader";
import { getAllBoardsName } from "@/services/boards.service";
import { getAllSets, createSet } from "@/services/sets.service";
import SaveIcon from "@mui/icons-material/Save";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Switch from "@mui/material/Switch";
import Autocomplete from "@mui/material/Autocomplete";
import Slider from "react-slick";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function Sets() {
  const router = useRouter();
  const [sets, setSets] = useState([]);
  const [modalopen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isImages, setIsImages] = useState(true);
  const [imagefiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [video, setVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBoards, setSelectedBoards] = useState([]);
  const [boardNames, setBoardNames] = useState([]);

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const userId = currentUser.uid;
    const unSub = () =>
      getAllSets(userId, (documents) => {
        setSets(documents);
        console.log("sets", documents);
      });
    return () => {
      unSub();
    };
  }, []);

  useEffect(() => {
    const unSub = () =>
      getAllBoardsName((documents) => {
        setBoardNames(documents);
        console.log("board names", documents);
      });
    return () => {
      unSub();
    };
  }, []);

  const handleImageUrls = (files) => {
    if (imageUrls.length < 4) {
      setImageUrls([...imageUrls, files.base64]);
      setImageFiles([...imagefiles, files?.fileList[0]]);
    }
  };

  const handleVideoUrl = (files) => {
    if (!videoUrl) {
      setVideoUrl(files.base64);
      setVideo(files?.fileList[0]);
    }
  };

  function resetForm() {
    setName("");
    setDescription("");
    setIsImages(true);
    setImageFiles([]);
    setImageUrls([]);
    setVideo(null);
    setVideoUrl(null);
    setSelectedBoards([]);
    setLoading(false);
    setModalOpen(false);
  }

  const handleChange = (event, newValue) => {
    console.log("selected boards", newValue);
    setSelectedBoards(newValue);
  };

  async function save() {
    try {
      setLoading(true);
      await createSet({
        name,
        description,
        isImages,
        images: isImages ? imagefiles : null,
        video: isImages ? null : video,
        boards: selectedBoards,
        userId: currentUser.uid,
      });
      resetForm();
      toast.success("Set created successfully!");
    } catch (error) {
      setError(error);
      console.log(error);
      toast.error("Something went wrong!");
    }
  }

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

  return (
    <MainLayout>
      <Head>
        <title>Create Next App | Boards</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="page-content">
        <div className="flex justify-between">
          <h1>All Sets</h1>
          <Button
            variant="contained"
            className="gap-2"
            onClick={() => setModalOpen(true)}
          >
            <AddIcon />
            Add New
          </Button>
        </div>
        <Box sx={{ flexGrow: 1, py: 2 }}>
          <Grid container spacing={2}>
            {[...sets].map((item, i) => (
              <Grid item xs={3} key={item.id}>
                <Item className="cursor-pointer flex justify-center flex-col">
                  {item?.images && (
                    <Slider {...sliderSettings}>
                      {item?.images.map((image, i) => (
                        <img key={i} src={image.downloadURL}  className="h-44 w-auto"/>
                      ))}
                    </Slider>
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
                  <div className="flex justify-center gap-2">
                    {item.boards.map((board, i)=> <span onClick={()=> router.push(`/user/boards/${board.id}`)} className="bg-gray-200 p-2 rounded" key={i}>{board.name}</span>)}
                  </div>
                </Item>
              </Grid>
            ))}
          </Grid>

          <Modal
            open={modalopen}
            onClose={() => setModalOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <h4>Add New Set</h4>
              <TextField
                required
                id="name"
                label="Name"
                placeholder="Name"
                variant="standard"
                className="w-100 mb-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                id="description"
                label="Description"
                className="w-100 mb-3"
                multiline
                maxRows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="flex justify-between ali">
                <p className="mt-1">Video</p>
                <Switch
                  checked={isImages}
                  onChange={(e) => setIsImages(!isImages)}
                />
                <p className="mt-1">Images</p>
              </div>
              {isImages && (
                <div>
                  {/* <p>Images</p> */}
                  <div className="flex mb-3 gap-3 flex-wrap">
                    {imageUrls.map((url, i) => (
                      <img src={url} key={i} className="w-25 mb-3" />
                    ))}
                    {imageUrls.length < 3 && (
                      <div className="w-25 justify-center flex">
                        <ReactFileReader
                          fileTypes={[".png", ".jpg"]}
                          base64={true}
                          handleFiles={handleImageUrls}
                        >
                          <div>
                            <AddPhotoAlternateIcon
                              className="cursor-pointer text-gray-400"
                              style={{ width: 50, height: 50 }}
                            />
                          </div>
                        </ReactFileReader>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {!isImages && (
                <div>
                  {/* <p>Video</p> */}
                  <div className="mb-2">
                    {videoUrl && (
                      <video width="640" height="360" controls>
                        <source src={videoUrl} type="video/mp4" />
                        <source src={videoUrl} type="video/webm" />
                        <source src={videoUrl} type="video/avi" />
                      </video>
                    )}
                    {!videoUrl && (
                      <div>
                        <p className="text-blue-400">
                          *File type .mp4, .avi or .webm
                        </p>
                        <div className="w-100 h-20 justify-center flex items-center border-2 rounded">
                          <ReactFileReader
                            fileTypes={[".mp4", ".avi", ".webm"]}
                            base64={true}
                            handleFiles={handleVideoUrl}
                          >
                            <AddPhotoAlternateIcon
                              className="cursor-pointer text-gray-400"
                              style={{ width: 50, height: 50 }}
                            />
                          </ReactFileReader>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <Autocomplete
                multiple
                limitTags={2}
                id="selected-boards"
                options={boardNames}
                getOptionLabel={(option) => option.name}
                onChange={handleChange}
                value={selectedBoards}
                className="w-100 mb-3"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Assign on boards"
                    placeholder="Assign on boards"
                  />
                )}
              />
              <LoadingButton
                loading={loading}
                className="w-100"
                loadingPosition="start"
                startIcon={<SaveIcon />}
                variant="contained"
                onClick={save}
              >
                Save
              </LoadingButton>
            </Box>
          </Modal>
        </Box>
      </div>
    </MainLayout>
  );
}

export default Auth(Sets);
