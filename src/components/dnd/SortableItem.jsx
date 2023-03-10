import React, { FC } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Item, { ItemProps } from "./Item";
import Set from "@/components/Set";
import ControlCameraIcon from "@mui/icons-material/ControlCamera";

const SortableItem = (props) => {
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...props}>
      <Set
        item={props.data}
        dragableButton={
          props.dragable === "true" ? (
            <button className="py-1" {...attributes} {...listeners}>
              <ControlCameraIcon />
            </button>
          ) : null
        }
      />
    </div>
  );
};

export default SortableItem;
