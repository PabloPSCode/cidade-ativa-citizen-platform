import toast, {type ToastOptions } from "react-hot-toast";

type Position = Pick<ToastOptions, "position"> & { id?: string };

const showToastError = (msg: string, position?: Position) =>
  toast.error(msg, {
    style: {
      fontSize: "14px",
    },
    id: "error",
    position: position?.position || "top-right",
  });

const showToastSuccess = (msg: string, position?: Position) =>
  toast.success(msg, {
    style: {
      fontSize: "14px",
    },
    id: "success",
    position: position?.position || "top-right",
  });

const showToastLoading = (msg: string, position?: Position) =>
  toast.loading(msg, {
    style: {
      fontSize: "14px",
    },
    id: "loading",
    position: position?.position || "top-right",
  });

export { showToastError, showToastLoading, showToastSuccess };
