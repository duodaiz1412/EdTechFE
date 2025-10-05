export const formatPrice = (price: number = 0, currency: string = "USD") => {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: currency,
  });

  return formatter.format(price);
};
