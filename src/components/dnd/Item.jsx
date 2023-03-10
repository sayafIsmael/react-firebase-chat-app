import React, { forwardRef, HTMLAttributes, CSSProperties } from "react";
import Set from "@/components/Set";

const Item = forwardRef(
  (
    {
      id,
      data,
      withOpacity,
      isDragging,
      style,
      ...props
    },
    ref
  ) => {
    const inlineStyles = {
      opacity: withOpacity ? "0.5" : "1",
      // transformOrigin: "50% 50%",
      // height: "140px",
      // width: "200px",
      borderRadius: "10px",
      cursor: isDragging ? "grabbing" : "grab",
      backgroundColor: "#ffffff",
      justifyContent: "center",
      alignItems: "center",
      boxShadow: isDragging
        ? "rgb(63 63 68 / 5%) 0px 2px 0px 2px, rgb(34 33 81 / 15%) 0px 2px 3px 2px"
        : "rgb(63 63 68 / 5%) 0px 0px 0px 1px, rgb(34 33 81 / 15%) 0px 1px 3px 0px",
      transform: isDragging ? "scale(1.05)" : "scale(1)",
      ...style,
    };

    return (
      <div ref={ref} style={inlineStyles} {...props}>
        {data && <Set item={data} showBoards={false} />}
      </div>
    );
  }
);

export default Item;
