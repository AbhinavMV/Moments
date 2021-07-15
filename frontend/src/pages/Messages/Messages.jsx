import { Container, Divider, Grid, Typography } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";

import FriendsList from "../../components/FriendsList";
import MessageBox from "../../components/MessageBox";

const Messages = () => {
  return (
    <Container maxWidth="lg">
      <Grid container alignItems="stretch" justifyContent="center" style={{ width: "100%" }}>
        <Grid
          container
          item
          sm={4}
          alignContent="stretch"
          style={{
            backgroundColor: grey[200],
            flexGrow: 1,
            minHeight: 0,
          }}
        >
          <div
            style={{
              backgroundColor: grey[200],
              flexGrow: 1,
              minHeight: 0,
            }}
          >
            <Typography variant="h6" component="h4">
              Friends List
            </Typography>
            <FriendsList />
          </div>
        </Grid>
        <Divider orientation="vertical" />
        <Grid container item xs={12} sm={7}>
          <MessageBox />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Messages;
