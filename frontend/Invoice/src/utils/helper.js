export const validateEmail = (email) => {
  // FIX 1: Removed unnecessary spaces inside the regex that prevent it from matching properly.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) return "Email is required";

  if (!emailRegex.test(email)) return "Please enter a valid email address";

  // FIX 2: Removed the syntax error dash (return-"") and replaced it with a valid return statement.
  return "";
};

export const validatePassword = (password) => {
  if (!password) return "Password is required";

  if (password.length < 6) return "Password must be at least 6 characters";

  return "";
};


