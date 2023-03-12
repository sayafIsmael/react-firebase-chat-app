import Head from "next/head";
import React, { useContext, useState, useCallback, useEffect } from "react";
import Auth from "@/utils/Auth";
import MainLayout from "@/layouts/MainLayout";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Modal from "@mui/material/Modal";
import { modalStyle } from "@/styles/mui";
import TextField from "@mui/material/TextField";
import { FiCamera } from "react-icons/fi";
import ReactFileReader from "react-file-reader";
import { getAllBoardsByUserId, createBoard } from "@/services/boards.service";
import SaveIcon from "@mui/icons-material/Save";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Board from "@/components/Board";

function Boards() {
  const router = useRouter();
  const [boards, setBoards] = useState([]);
  const [modalopen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [defaultPositions, setDefaultPositions] = useState([1]);
  const [point, setPoint] = useState(9);
  const [files, setFiles] = useState(null);
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successBoard, setSuccessBoard] = useState({ name: "", id: "" });

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    getAllBoardsByUserId(currentUser.uid, (documents) => {
      setBoards(documents);
      console.log("boards", documents);
    });
  }, []);

  function editPosition(e, index) {
    const poitions = [...defaultPositions];
    poitions[index] = Number(e.target.value);
    setDefaultPositions(poitions);
  }

  const handleFiles = (files) => {
    setUrl(files.base64);
    setFiles(files);
  };

  function resetForm() {
    setName("");
    setDescription("");
    setDefaultPositions([10]);
    setPoint(9);
    setFiles(null);
    setUrl(null);
    setLoading(false);
    setModalOpen(false);
  }

  async function saveBoard() {
    try {
      setLoading(true);
      await createBoard(
        {
          name,
          description,
          defaultPositions,
          thumbnail: files?.fileList[0],
          userId: currentUser.uid,
        },
        (board) => {
          setSuccess(true);
          setSuccessBoard(board);
        }
      );
      resetForm();
    } catch (error) {
      setError(error);
      console.log(error);
      toast.error("Something went wrong!");
    }
  }

  async function copyInviteLink(text) {
    await navigator.clipboard.writeText(text);
    toast.success("Link copied successfully!");
  }

  return (
    <MainLayout>
      <Head>
        <title>Create Next App | Boards</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="page-content">
        <div className="flex justify-between">
          <h1>Boards</h1>
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
            {[...boards].map((item, i) => (
              <Board key={item.id} item={item} />
            ))}
          </Grid>

          <Modal
            open={modalopen}
            onClose={() => setModalOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <h4>Add new board</h4>
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
              <ReactFileReader
                fileTypes={[".png", ".jpg"]}
                base64={true}
                handleFiles={handleFiles}
              >
                <div className="cursor-pointer">
                  {url && <img src={url} className="w-100 mb-3" />}
                  {!url && (
                    <div className="flex mb-3 justify-between w-100">
                      <label>Add Thumbnail</label>
                      <FiCamera style={{ width: 30, height: 30 }} as={Button} />
                    </div>
                  )}
                </div>
              </ReactFileReader>
              {defaultPositions.map((point, i) => (
                <div className="flex justify-between mb-3 items-center" key={i}>
                  <p>Position: {i + 1}</p>
                  <TextField
                    className="w-10"
                    id={"position" + i}
                    label="points"
                    defaultValue={point}
                    variant="standard"
                    onChange={(e) => editPosition(e, i)}
                  />
                </div>
              ))}
              <Button
                disabled={loading}
                className="mb-3 w-100"
                variant="contained"
                onClick={() => setDefaultPositions([...defaultPositions, 1])}
              >
                Add New Position
              </Button>
              <LoadingButton
                loading={loading}
                className="w-100"
                loadingPosition="start"
                startIcon={<SaveIcon />}
                variant="contained"
                onClick={saveBoard}
              >
                Save
              </LoadingButton>
            </Box>
          </Modal>

          <Modal
            open={success}
            onClose={() => setSuccess(false)}
            aria-labelledby="success-modal-title"
            aria-describedby="success-modal-description"
          >
            <Box sx={modalStyle}>
              <div class="flex justify-center items-center">
                <div class="flex flex-col justify-center items-center">
                  <CheckCircleIcon
                    fontSize="large"
                    color="success"
                    style={{ fontSize: 80 }}
                  />
                  <p className="text-2xl">Success</p>
                  <p>
                    <span className="font-bold">Board</span> {successBoard.name}{" "}
                    created successfully
                  </p>
                  <div className="flex">
                    <p className="mr-2">
                      <span className="font-bold">Invite link: </span>
                      {`${window.location.host}/boards/${successBoard.id
                        .toString()
                        .slice(0, 4)}..`}
                    </p>
                    <ContentCopyIcon
                      className="cursor-pointer"
                      onClick={() =>
                        copyInviteLink(
                          `${
                            window.location.host
                          }/boards/${successBoard.id.toString()}`
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </Box>
          </Modal>
        </Box>
      </div>
    </MainLayout>
  );
}

export default Auth(Boards);
