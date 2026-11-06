interface Review {
  id: number;
  name: string;
  initials: string;
  rating: number;
  date: string;
  text: string;
  verified: boolean;
}

export const MOCK_RATING_SUMMARY = {
  average: 4.7,
  total: 128,
  distribution: [
    { star: 5, count: 90, pct: 70 },
    { star: 4, count: 26, pct: 20 },
    { star: 3, count: 8,  pct: 6  },
    { star: 2, count: 3,  pct: 2  },
    { star: 1, count: 1,  pct: 1  },
  ],
};

export const MOCK_REVIEWS: Review[] = [
  {
    id: 1,
    name: "Nguyễn Minh Tuấn",
    initials: "MT",
    rating: 5,
    date: "2025-05-12",
    text: "Sản phẩm rất tốt, đúng mô tả, giao hàng nhanh. Mình rất hài lòng với chất lượng và hiệu năng.",
    verified: true,
  },
  {
    id: 2,
    name: "Trần Thị Lan",
    initials: "TL",
    rating: 4,
    date: "2025-04-28",
    text: "Hàng đẹp, đóng gói cẩn thận. Chỉ tiếc giao hơi chậm hơn dự kiến một ngày.",
    verified: true,
  },
  {
    id: 3,
    name: "Lê Văn Hoàng",
    initials: "LH",
    rating: 5,
    date: "2025-04-15",
    text: "Chất lượng vượt mong đợi, pin trâu dùng cả ngày không lo hết. Sẽ mua lại lần sau.",
    verified: false,
  },
];