import Head from "next/head";
import React, { useContext, useState, useCallback } from "react";
import Auth from "@/utils/Auth";
import MainLayout from "@/layouts/MainLayout";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import {modalStyle} from "@/styles/mui"

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

export default function BoardDetails({ board }) {
  const [modalopen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [items, setItems] = useState([
    {
      id: 1,
      thumbnail:
        "https://img.freepik.com/premium-vector/white-thumbnail-shadow-text-effect-editable_153358-57.jpg",
      name: "Card name",
      creator: "John",
      images: [
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATcAAACiCAMAAAATIHpEAAAAgVBMVEXrezz////pcyzqdzPqcSb52sz76eDxrIn30sLqdC7qcCPvnXT2xrD+9fHrejb30L7ukmX++ffzt53ysZLshk798OntjVv53dHzt5r99/P1wanxpoH65NnrgUT76+LqfDzti1j2ybTxro7umW7wonvtjlrpbhfoaAbrhEnsiVLzvKEdSe9tAAAHyElEQVR4nO2caX+qOhCHkURbqKK0dd9q9Z7r8ft/wCsqyUyY4EIPeO7v/7xq2XnIMhOIQQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA11GRvhBGqumLCVQoEqnkzj0s9qaiwrobjiaeONKfH93FapixGs9e1rpZdWryKtHffI88l6be++W8HvL9om7hwGv3aPPCJm9FceG+22txVpN19MMu7iHst7wsJkGxfATh2L/HmXG+l14V1m0dKeFrYZNv93GpZCOe56C9deKPU+btSFcVylzYvuatbbx1Cus+nOPF08ImL84m4aC4zZnVvrHKesVbK926Re4Gb/qyqeBt7BxOFXd3vIUvJacaNCXumrfjbWhnj0reVjE7WPJ2zVs0Lz3XqCFx17215rz9reatxZuk6HDFW/K7/Fzp83prjdi9VvQ2YAfTQifDvOnhrSerl1u89dilVfQ2Y6U3FrRQb9GEr5sOV8OUL3prpMRxb2lG8U7e6b1W609br6xjWAq7U2+KXc14Gx6zhWjHwptFIwWOeXuLkiPr5aDL5aVeb6lEqbcpvU2pW6De1DddcYjPdVxpFvQNmojiuLfLFSdhtGG3QqMu5m30SxcxJUryxjqGaFbujR2gbbvimJa4vhCc/3FEb9mVsY6O1gXmrfxZi952vmcgePuky5d2v2RAlqfP5C2I2S3tyR6PeTPnmZCT6Lw9mJLLsN7UBzkV6zhZgWuionq98SabVNQHvf2T/zEm97/OFy6IIeuNJa+0nAaKVodDAwm+3xtrfEkv+KC3X/kfQ3soZXKBGWnorLeYDoIwOayithuoqH5vakvW9Gyb/KA3W7PsUJLtFuait7Vd2BryBE2n3lW14PcWhGRNiyx+zJs2J9qq4vqkK3grK1QsYG4g8i3xphdk1ZcR9KA3O6zRNTUuzAeI0n8lb4qm9BMuh13FV/0dQ1l5o6vmtrF+zJsamZJjOgYTZrz+Er3R7tQZXYrIDi1hhPhPU+KNXfakqrfEjFBO8xpny9MhlryxqHjueHv3r6uDMm+0mpDK9aA3O/SRB7D23AMteWNhiJO+K5rwu4PINVDiLdmRVTYQedSbHWrLxdgGNAolb2yQiQ9m8cx1Vn8AV+aNBiI2Wn3Um41r8jjVDHYsdCR6ox3Tkh+aVYZN/QFciTeWHS5kb19xMa2X0/LExjWXZ5B85Qu6keyNJlPOA2IjKa/P5S0hqzqyt+GiQOdFiM+y+zYhV+98m7aq7ZTsjcZorreGE4YybzEVZGLyq+OW7x5v4Sb/+/O01o5VLQPRmz/Nct47PLG3XnVvtknanQqPqYZp7PFG35u6TT9tRMb1D/nW6I22Z9la8+q0H3q80VFnt0jtqbcnK2/kun/AW6DzencqH4lJII4xdUVvT1beftqbiceyg9lu4RiawVuJN5sbZR2DzQaSAN7KvNmYK1NjuoXsrv9f3siqn/Bme4KsY2D/3O/tL+lPh3Lcm/amLumH15spYsfswwauO289pXHIX+rNky+M7sizyMmmOlCmscsyz7vj3uCJ4146vO/JT+/I6wOajI8S0y1MsxbgujdnqMhGMU/njaUy1cdDsgWmMZ8rk62eXrffn58+b17PxpH6lcffTvvmJWgTmsJ8GkmWvdHX/WXjSA186VDmjT7SWeXxXrbvIjYP5ZTkXx9/+80PzcYtu081bul5nVTFm31l8e+ErRC9sXHyLW/gFH2/4LzrqoMyb/SRVn6fddrQVv19fpRzwyl6Y++sdtwNey/jfoFeA7e+B/xd9f3pecPInCpv888NgOit9D0gfdf1XO8B2WsR+3FCJW9miWm6zuVI9kYbCuedFavDo+fyJqan1bzZMV/+QERvng79fOhh4Ri14vdmhxlbLLKs5E25sxEu+ZvojX1KtuK5FM3Bek/1XQ1rQUiPVckby0EyLsVI9kZLfIt5Y+lCA+lp2fdvNKsmLUg1b9qZ13d5ILI3dio2I451GQ2Eb35vIf2QoEcal2re3NmElzRA9sa+qmQvl1lIvK0/DPF6U7R1Y9dczRsrKK3ziHng88ZqI51RlLAPppuYhyp7S/SAzWCgHb0zjlQ24Vnwxt4X26ZJ9sZ7zQ35Dp+W2iY+U+XetufRtDgc8NlHbEoK87ZoS+QzbwVvbFDPpr0ebyybMjMTEz5JoIGo1/F2/mph1XOnGrHaeH2ekWmoJW+sZTL37PHmdL+bpT6WZv3JrmDYRHG7aV4bn3JX0RtLOk3E6vMWsq3P5duZfN5Achrc5C3l9aCiNxb5mq9OfN6ciW0CnUamtd3izZlSXNEbSwJMP+33Js18o+yb+W2C697c6KiqN9pHmjTE643HkUWamX163dvwy72wqt7o/mbal99boIWp5IZdI51CcNXbrPjrMVW9kcg3NW1TibdA0++MGb1RYz+9UuZteFhLv7tS0RuJfMc3eQvUuvjjLBmzqLnfXYk2016B6bDTnn0vtfg0o35xB4f8h37CsTn4lAwMmGUHm4nOzJapEFjo/cydiN+ZSA+1PqJYIJvF7m1wQ2kPhipuSqMFXdiOXYZ44ij+fJu1x4tOp7MYtw/bpbwZKKKi0PyOWXMVFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAODyH4u3fxFI2RxVAAAAAElFTkSuQmCC",
      ],
      video:
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    },
    {
      id: 2,
      thumbnail: "https://i.ytimg.com/vi/uieGdbrzLnQ/maxresdefault.jpg",
      name: "Card name",
      creator: "John",
      images: [
        "data:image/png;base64,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",
      ],
      video:
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    },
    {
      id: 3,
      thumbnail:
        "https://thumbs.dreamstime.com/b/editable-text-effect-gaming-thumbnail-style-can-be-use-to-make-title-210867464.jpg",
      name: "Card name",
      creator: "John",
      images: [
        "data:image/png;base64,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",
      ],
      video:
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    },
    {
      id: 4,
      thumbnail:
        "data:image/jpeg;base64,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",
      name: "Card name",
      creator: "John",
      images: [
        "data:image/png;base64,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",
      ],
      video:
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    },
  ]);
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleDragStart = useCallback((event) => {
    setSelectedItem(
      items[items.findIndex((item) => item.id === event.active.id)]
    );
    setActiveId(event.active.id);
  }, []);
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
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
        <h4>Board Name</h4>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, nemo?
          Minus impedit aut amet quidem qui, necessitatibus nemo. Ex ipsum quae
          repellendus velit aut eligendi deserunt reiciendis facere beatae
          recusandae!
        </p>
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
                  onClick={() => setModalOpen(true)}
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
              <img src={selectedItem.thumbnail} className="mb-2"/>
              <Button variant="contained" onClick={() => setModalOpen(false)}>
                Close
              </Button>
            </Box>
          </Modal>
        </Box>
      </div>
    </MainLayout>
  );
}
