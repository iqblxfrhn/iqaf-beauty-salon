import { View, Text, Image } from "react-native";
import React from "react";
import Ratings from "@/utils/ratings";
import moment from "moment";

export default function ProductReviewCard({ item }: { item: ReviewType }) {
  const formatTimestamp = (timestamp: any) => {
    const now = moment();
    const reviewTime = moment(timestamp);
    const diffInMinutes = now.diff(reviewTime, "minutes");
    const diffInHours = now.diff(reviewTime, "hours");
    const diffInDays = now.diff(reviewTime, "days");
    const diffInWeeks = now.diff(reviewTime, "weeks");
    const diffInMonths = now.diff(reviewTime, "months");
    const diffInYears = now.diff(reviewTime, "years");

    if (diffInMinutes < 1) {
      return "Baru Saja";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} Menit Lalu`;
    } else if (diffInHours < 24) {
      return `${diffInHours} Jam Lalu`;
    } else if (diffInDays === 1) {
      return "1 Hari Lalu";
    } else if (diffInDays < 7) {
      return `${diffInDays} Hari Lalu`;
    } else if (diffInWeeks === 1) {
      return "1 Minggu Lalu";
    } else if (diffInWeeks < 4) {
      return `${diffInWeeks} Minggu Lalu`;
    } else if (diffInMonths === 1) {
      return "1 Bulan Lalu";
    } else if (diffInMonths < 12) {
      return `${diffInMonths} Bulan Lalu`;
    } else if (diffInYears === 1) {
      return "1 Tahun Lalu";
    } else {
      return `${diffInYears} Tahun Lalu`;
    }
  };

  return (
    <View
      style={{
        paddingBottom: 5,
        borderBottomColor: "#E1E2E5",
        borderBottomWidth: 1,
      }}
    >
      <View style={{ justifyContent: "space-around" }}>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
          }}
        >
          <Image
            style={{
              width: 40,
              height: 40,
              borderRadius: 100,
            }}
            source={{
              uri:
                item.user?.avatar ||
                "https://res.cloudinary.com/iqbalxfrhn/image/upload/v1721111006/avatars/user_rm4mol.jpg",
            }}
          />

          <Text style={{ fontFamily: "Poppins_700Bold", fontSize: 14 }}>
            {item.user?.name}
          </Text>
        </View>
        <View style={{marginTop: -20}}>
          <Ratings rating={item.rating} />
        </View>
      </View>
      <View style={{ marginTop: 15 }}>
        <Text
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: 12,
            textAlign: "justify",
            color: "#575757",
          }}
        >
          {item?.comment}
        </Text>
      </View>
      <View style={{ marginTop: 4 }}>
        <Text
          style={{
            fontFamily: "Poppins_600SemiBold",
            fontSize: 10,
          }}
        >
          {formatTimestamp(item?.createdAt)}
        </Text>
      </View>
    </View>
  );
}
