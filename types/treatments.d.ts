type TreatmentsType = {
  _id: string;
  name: string;
  description: string;
  price: number;
  estimatedPrice: number;
  duration: number;
  image: {
    public_id: string | any;
    url: string | any;
  };
  reviews: ReviewType[];
  ratings?: number;
  booked: number;
  selectedTime: string
  selectedDate: string
  
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


type BookingsType = {
  _id: string;
  userId: user;
  treatmentId: TreatmentsType;
  bookingDate: string
  bookingTime: string
  status: string
  createdAt: Date
}