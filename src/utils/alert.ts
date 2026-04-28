import Swal, { SweetAlertResult } from "sweetalert2";

export const Alert = {
  success: (title: string, text?: string): Promise<SweetAlertResult> =>
    Swal.fire({
      icon: "success",
      title,
      text,
      timer: 2000,
      showConfirmButton: false,
      toast: false,
    }),

  error: (title: string, text?: string): Promise<SweetAlertResult> =>
    Swal.fire({ icon: "error", title, text, confirmButtonColor: "#dc3545" }),

  confirm: (
    title: string,
    text = "This action cannot be undone!"
  ): Promise<SweetAlertResult> =>
    Swal.fire({
      icon: "warning",
      title,
      text,
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }),

  toast: (
    title: string,
    icon: "success" | "error" | "warning" | "info" = "success"
  ): void => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  },

  loading: (title = "Processing..."): void => {
    Swal.fire({
      title,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
  },

  close: (): void => Swal.close(),
};
