const ERROR_MESSAGES = {
  user: {
    Conflict: "User Already Exists.",
    Invalid: "Invalid Credentials Provided.",
    Created: "Successfully Registered.",
  },
  editor: {
    Invalid: "Invalid Editor Nodes/Edges.",
    Updated: "Successfully Saved Editor Nodes/Edges.",
  },
  default: "Something went wrong. Please try again later.",
};

export function handleErrors(type: "user" | "editor", message: string | null) {
  switch (type) {
    case "user":
      return handleUserErrors(message);
    case "editor":
      return handleEditorErrors(message);
    default:
      return ERROR_MESSAGES["default"];
  }
}

function handleUserErrors(message: string | null) {
  switch (message) {
    case "Conflict":
      return ERROR_MESSAGES["user"][message];
    case "Invalid":
      return ERROR_MESSAGES["user"][message];
    case "Created":
      return ERROR_MESSAGES["user"][message];
    default:
      return ERROR_MESSAGES["default"];
  }
}

function handleEditorErrors(message: string | null) {
  switch (message) {
    case "Invalid":
      return ERROR_MESSAGES["editor"][message];
    case "Updated":
      return ERROR_MESSAGES["editor"][message];
    default:
      return ERROR_MESSAGES["default"];
  }
}
