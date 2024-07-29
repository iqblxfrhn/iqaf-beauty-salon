type ProductsType = {
    _id: string
  name: string
  description: string
  price: number
  estimatedPrice: number
  tags: string
  image: {
    public_id: string | any;
    url: string | any;
  };
  stock: number
  reviews: ReviewType[]
  ratings?: number
  purchased: number;
  quantity: number
  
};

type ReviewType = {
  user: User;
  rating?: number;
  comment: string;
  commentReplies?: ReviewType[];
  createdAt: Date;
};

type CommentType = {
  _id: string;
  user: User;
  question: string;
  questionReplies: CommentType[];
};

type OrdersType = {
  _id: string;
  userId: User;
  productId: ProductsType
  quantity: number
  status: string
  payment_info: string
  deliveredAt: Date
  createdAt: Date
}
