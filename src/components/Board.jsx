import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Board = ({ item }) => {
  const router = useRouter();

  async function copyInviteLink(e, text) {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(text);
    toast.success("Link copied successfully!");
  }

  return (
    <Grid item xs={3}>
      <Item
        className="cursor-pointer flex justify-center flex-col"
        onClick={() => router.push(`/boards/${item.id}`)}
      >
        <img
          className="h-44 w-auto bg-cover mb-2"
          src={item.thumbnail}
          style={{ height: 200 }}
        />
        <h4>{item.name}</h4>
        <p>
          {item.description.substr(0, 50) +
            (item.description.length > 50 ? "..." : "")}
        </p>
        <div className="flex justify-center">
          <p className="mr-2">
            <span className="font-bold">Invite link: </span>
            {`${window.location.host}/boards/${item.id
              .toString()
              .slice(0, 4)}..`}
          </p>
          <ContentCopyIcon
            className="cursor-pointer"
            onClick={(e) =>
              copyInviteLink(
                e,
                `${window.location.host}/boards/${item.id.toString()}`
              )
            }
          />
        </div>
        {/* <p>User reviews: {item.reviews.length}</p> */}
      </Item>
    </Grid>
  );
};

export default Board;
