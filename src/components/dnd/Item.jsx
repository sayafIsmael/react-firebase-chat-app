import React, { forwardRef, HTMLAttributes, CSSProperties } from "react";

const Item = forwardRef(
  ({ id, data, withOpacity, isDragging, style, ...props }, ref) => {
    const inlineStyles = {
      opacity: withOpacity ? "0.5" : "1",
      transformOrigin: "50% 50%",
      height: "140px",
      width: "200px",
      borderRadius: "10px",
      cursor: isDragging ? "grabbing" : "grab",
      backgroundColor: "#ffffff",
      display: "flex",
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
        {data && data.images && <img src={data?.images[0]?.downloadURL} />}
        {data && data.video && (
          <video width="640" height="360" controls className="h-44 w-auto">
            <source src={data?.video.downloadURL} type="video/mp4" />
            <source src={data?.video.downloadURL} type="video/webm" />
            <source src={data?.video.downloadURL} type="video/avi" />
          </video>
        )}
      </div>
    );
  }
);

export default Item;
