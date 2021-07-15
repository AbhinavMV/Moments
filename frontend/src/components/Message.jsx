import { Typography } from "@material-ui/core";
import { grey, lightBlue } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  message: {
    marginLeft: (props) => props.userId === props.message?.from.id && "auto",
    backgroundColor: (props) =>
      props.userId === props.message?.from.id ? grey[400] : lightBlue[400],
    borderRadius: 50,
    width: "fit-content",
    padding: 5,
    margin: 5,
  },
}));

const Message = ({ ref, userId, message }) => {
  const classes = useStyles({ userId, message });

  return (
    <div className={classes.message}>
      <Typography variant="subtitle1" component="p">
        {message.content}
      </Typography>
    </div>
  );
};

export default Message;
