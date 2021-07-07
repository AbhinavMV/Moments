import { port } from "./config/environment";
import app from "./app";

try {
  app.listen(port, () => console.log("Sever running on", port));
} catch (err) {
  console.log(err);
}
