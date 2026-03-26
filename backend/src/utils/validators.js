export const validateAuth = ({ email, password }) => {
  if (!email || !password) {
    throw { status: 400, message: "Email and password required" };
  }

  if (password.length < 6) {
    throw { status: 400, message: "Password must be at least 6 chars" };
  }
};

export const validateEntry = ({ calories, water }) => {
  if (!calories || !water) {
    throw { status: 400, message: "Calories & water required" };
  }

  if (isNaN(calories) || isNaN(water)) {
    throw { status: 400, message: "Must be numbers" };
  }
};

export const validateGoal = ({ calories, water }) => {
  if (!calories || !water) {
    throw { status: 400, message: "Goal required" };
  }
};
