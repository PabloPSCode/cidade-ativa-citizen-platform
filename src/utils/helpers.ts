export const sendMessageWhatsapp = (message: string, phoneNumber: string) => {
  if (typeof window === "undefined") return;
  return window.open(
    `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
    "_blank"
  );
};
