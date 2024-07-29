type onBoardingSwiperDataType = {
  id: number;
  title: string;
  description: string;
  image: any;
};

type Avatar = {
  public_id: string;
  url: string;
};

type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatar?: Avatar;
  products: any;
  treatments: any;
  address: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
};

type BannerDataTypes = {
  bannerImagerUrl: any;
};

type DayInfo = {
  date: Moment;
  day: string;
  formattedDate: string;
  dayNumber: number; // Tanggal

};
type Time = {
  times: string;
}

type CouponsType = {
  _id: string;
  code: string;
  discount: number;
  expiredDate: Date;
  
}
