import axios from "axios";

/** true khi request không tới được server (mất mạng, BE chưa chạy, CORS...) */
export const isNetworkError = (error: unknown): boolean =>
  axios.isAxiosError(error) && !error.response;

export const getStatus = (error: unknown): number | undefined =>
  axios.isAxiosError(error) ? error.response?.status : undefined;

/** BE trả lỗi dạng ApiResponse { status, message, timestamp } */
export const getErrorMessage = (error: unknown, fallback = "Đã có lỗi xảy ra. Vui lòng thử lại."): string => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    if (!error.response) return "Không kết nối được máy chủ. Vui lòng thử lại sau.";
    const msg = error.response.data?.message;
    if (typeof msg === "string" && msg.trim()) return msg;
  }
  return fallback;
};
