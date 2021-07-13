import { Grid, TextField } from "@material-ui/core";

export default function Input({ half, name, label, password, value, onChange }) {
  return (
    <Grid item xs={half ? 6 : 12}>
      <TextField
        required
        fullWidth
        variant="outlined"
        name={name}
        label={label}
        type={password ? "password" : "text"}
        value={value}
        onChange={onChange}
      />
    </Grid>
  );
}
