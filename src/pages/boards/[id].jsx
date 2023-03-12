import Head from "next/head";
import React, { useContext, useEffect, useState, useCallback } from "react";
import Auth from "@/utils/Auth";
import MainLayout from "@/layouts/MainLayout";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { modalStyle } from "@/styles/mui";
import { getBoardDetails, createReview } from "@/services/boards.service";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { AuthContext } from "@/context/AuthContext";
import Set from "@/components/Set";

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
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export default function BoardDetails() {
  const router = useRouter();
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [reviewd, setReviewd] = useState({});
  const [board, setBoard] = useState({
    name: "",
    description: "",
    thumbnail: "",
  });
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const { id } = router.query;

  useEffect(() => {
    setLoading(true);
    getBoardDetails(currentUser.uid, id, (documents) => {
      setItems(documents?.sets || []);
      setBoard(documents?.board);
      setReviewd(documents?.reviewd);
      console.log("board details", documents);
      setLoading(false);
    });
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

  const handleSubmitReview = async () => {
    const { defaultPositions, id } = board;
    const sets = [...items];
    const leaderboardSets = [];

    sets.map((set, index) => {
      leaderboardSets.push({
        point: defaultPositions[index] || 0,
        ...set,
      });
    });

    const data = {
      boardId: id,
      userId: currentUser.uid,
      sets,
      leaderboardData: leaderboardSets,
    };

    try {
      setLoading(true)
      await createReview(data);
      toast.success("Review submitted successfully!");
      setReviewd(true)
      setLoading(false)
    } catch ({ error }) {
      setLoading(false)
      toast.error(error);
    }
  };

  return (
    <MainLayout>
      <Head>
        <title>Create Next App | Boards</title>
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
          {!reviewd && items.length > 0 && (
            <Button
              variant="contained"
              className="h-10"
              onClick={handleSubmitReview}
            >
              Submit Review
            </Button>
          )}
        </div>
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
                  <SortableItem key={item.id} id={item.id} data={item} dragable={reviewd ? "false":  "true"}/>
                ))}
              </Grid>
            </SortableContext>
            <DragOverlay adjustScale style={{ transformOrigin: "0 0 " }}>
              {activeId ? (
                <Item
                  id={activeId}
                  isDragging
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        </Box>
      </div>
    </MainLayout>
  );
}
