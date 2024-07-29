import { View, Text } from "react-native";
import React from "react";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

export default function Ratings({ rating }: { rating: any }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<FontAwesome key={i} name="star" size={16} color={"#FFC107"} />);
    } else if (rating === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(
        <Ionicons key={i} name="star-half-outline" size={16} color={"#FFC107"} />
      );
    } else {
      stars.push(<Ionicons key={i} name="star-outline" size={16} color={"#FFC107"} />);
    }
  }
  return (
    <View style={{marginLeft: 50}}>
      <View style={{ flexDirection: "row", gap: 4 }}>{stars}</View>
    </View>
  );
}
