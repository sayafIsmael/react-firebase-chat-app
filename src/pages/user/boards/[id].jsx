import Head from "next/head";
import React, { useContext, useEffect, useState, useCallback } from "react";
import Auth from "@/utils/Auth";
import MainLayout from "@/layouts/MainLayout";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { modalStyle } from "@/styles/mui";
import { getBoardDetails } from "@/services/boards.service";
import { useRouter } from "next/router";

// import Grid from "@mui/material/Grid";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import Grid from "@/components/dnd/Grid";
import SortableItem from "@/components/dnd/SortableItem";
import Item from "@/components/dnd/Item";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

export default function BoardDetails() {
  const router = useRouter();

  const [modalopen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [modalItem, setModalItem] = useState({});
  const [board, setBoard] = useState({
    name: "",
    description: "",
    thumbnail: "",
  });
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const { id } = router.query;

  // useEffect(() => {
  //   const unSub = () =>
  //     getAllBoards((documents) => {
  //       setBoards(documents);
  //       console.log(documents);
  //     });
  //   return () => {
  //     unSub();
  //   };
  // }, []);

  useEffect(() => {
    const unSub = () =>
      getBoardDetails(id, (documents) => {
        setItems(documents?.sets || []);
        setBoard(documents?.board);
        console.log("board details", documents);
      });
    return () => {
      unSub();
    };
  }, []);

  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id == active.id);
        const newIndex = items.findIndex((item) => item.id == over.id);
        console.log("setitems", oldIndex);
        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  }, []);
  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  return (
    <MainLayout>
      <Head>
        <title>Create Next App | Boards</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="page-content">
        <h4>{board.name}</h4>
        <p> {board.description}</p>
        <Box sx={{ flexGrow: 1, py: 2 }}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <SortableContext items={items} strategy={rectSortingStrategy}>
              <Grid columns={5}>
                {items.map((item) => (
                  <SortableItem key={item.id} id={item.id} data={item} />
                ))}
              </Grid>
            </SortableContext>
            <DragOverlay adjustScale style={{ transformOrigin: "0 0 " }}>
              {activeId ? (
                <Item
                  id={activeId}
                  isDragging
                  onClick={() => {
                    setModalItem(items[items.findIndex((item) => item.id == activeId)])
                    setModalOpen(true)
                  }}
                />
              ) : null}
            </DragOverlay>
          </DndContext>

          <Modal
            open={modalopen}
            onClose={() => setModalOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <div className="mb-2">
                {modalItem && modalItem.images && (
                  <img className="w-100" src={modalItem?.images[0]?.downloadURL} />
                )}
                {modalItem && modalItem.video && (
                  <video
                    width="640"
                    height="360"
                    controls
                    className="h-44 w-auto"
                  >
                    <source
                      src={modalItem?.video.downloadURL}
                      type="video/mp4"
                    />
                    <source
                      src={modalItem?.video.downloadURL}
                      type="video/webm"
                    />
                    <source
                      src={modalItem?.video.downloadURL}
                      type="video/avi"
                    />
                  </video>
                )}
                <p className="mb-2 text-center text-xl">{modalItem?.name}</p>
                <p className="mb-2 text-center">{modalItem?.description}</p>
              </div>
              <Button
                variant="contained"
                className="w-100"
                onClick={() => setModalOpen(false)}
              >
                Close
              </Button>
            </Box>
          </Modal>
        </Box>
      </div>
    </MainLayout>
  );
}
