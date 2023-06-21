import toast from "react-hot-toast";

export const ToastSuccess = (id, success) => {
  toast.success(success, {
    id: id.toString(),
    duration: 4000,
    position: "top-center",
    ariaProps: {
      role: "status",
      "aria-live": "polite",
    },
    style: {
      borderRadius: "5px",
      background: "#24282B",
      color: "#A8ACAF",
    },
  });
};

export const ToastError = (id, error) => {
  toast.error(error, {
    id: id.toString(),
    duration: 4000,
    position: "top-center",
    ariaProps: {
      role: "status",
      "aria-live": "polite",
    },
    style: {
      borderRadius: "5px",
      background: "#24282B",
      color: "#A8ACAF",
    },
  });
};
