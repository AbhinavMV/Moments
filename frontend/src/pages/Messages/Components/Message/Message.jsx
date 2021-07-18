import { Avatar, Typography } from "@material-ui/core";
import { grey, lightBlue } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
// const useStyles = makeStyles((theme) => ({

// }));
import useStyles from "./StyleMessage";
const Message = ({ ref, userId, message }) => {
  const classes = useStyles({ userId, message });

  return (
    <div className={classes.container}>
      {message.from.id !== userId && (
        <Avatar style={{ backgroundColor: lightBlue[200] }}>
          {message.from.username.charAt(0)}
        </Avatar>
      )}
      <div className={classes.messageConatiner}>
        <div className={classes.message}>
          <Typography variant="subtitle1" component="p">
            {message.content}
          </Typography>
        </div>
        <Typography variant="caption">{new Date(message.createdAt).toLocaleString()}</Typography>
      </div>
    </div>
  );
};

export default Message;
