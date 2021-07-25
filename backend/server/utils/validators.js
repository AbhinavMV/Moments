export const validateNewUser = ({ name, username, email, password, confirmPassword }) => {
  const errors = {};
  if (name.trim() === "") errors.name = "Name cannot be empty";
  if (username.trim() === "") errors.username = "Username cannot be empty";
  if (email.trim() === "") errors.email = "Email cannot be empty";
  else {
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = "Email must be a valid email address";
    }
  }
  if (password.trim() === "") errors.password = "Password cannot be empty";
  if (confirmPassword.trim() === "") errors.password = "Passwords must match";
  else {
    if (password !== confirmPassword) {
      errors.password = "Passwords must match";
    }
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

export const validateLoginInput = (email, password) => {
  const errors = {};
  if (email.trim() === "") errors.email = "Email cannot be empty";
  if (password.trim() === "") errors.password = "Password cannot be empty";
  return {
    errors,
    valid: Object.keys(errors) < 1,
  };
};

export const validatePostInput = (caption) => {
  const errors = {};
  if (caption.trim() === "") errors.caption = "Caption cannot be empty";
  return {
    errors,
    valid: Object.keys(errors) < 1,
  };
};
