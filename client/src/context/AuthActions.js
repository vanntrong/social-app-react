export const LoginStart = (userCredentials) => {
  return {
    type: "LOGIN_START",
  };
};

export const LoginSuccess = (user) => {
  return {
    type: "LOGIN_SUCCESS",
    payload: user,
  };
};

export const LoginFailure = (error) => {
  return {
    type: "LOGIN_FAILURE",
    payload: error,
  };
};

export const Follow = (userId) => {
  return {
    type: "FOLLOW",
    payload: userId,
  };
};

export const UnFollow = (userId) => {
  return {
    type: "UNFOLLOW",
    payload: userId,
  };
};
