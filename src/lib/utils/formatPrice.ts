export const formatPrice = (price: number = 0, currency: string) => {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: currency,
  });

  return formatter.format(price);
};
