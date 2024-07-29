import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import {
  useFonts,
  Poppins_700Bold,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { router } from "expo-router";

export default function TreatmentCard({ item }: { item: TreatmentsType }) {
  let [fontsLoaded, fontError] = useFonts({
    Poppins_700Bold,
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const formatRupiah = (number: number) => {
    return "Rp." + number.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  return (
    <TouchableOpacity
    onPress={() =>
      router.push({
        pathname: "/(routes)/treatment-details",
        params: { item: JSON.stringify(item) },
      })
    }
      style={{
        backgroundColor: "#fff",
        borderRadius: 12,
        marginTop: 8,
        marginBottom: 8,
        width: 200,
        padding: 8,
        marginHorizontal: 3,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
      }}
    >
      <View>
        <Image
          style={{
            borderRadius: 6,
            alignSelf: "center",
            width: 190,
            height: 120,
            objectFit: "cover",
          }}
          source={{ uri: item?.image?.url! }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#141517",
              borderRadius: 5,
              gap: 4,
              width: 38,
              height: 28,
              justifyContent: "center",
              marginTop: 8,
            }}
          >
            <FontAwesome name="star" size={14} color={"#ffb800"} />
            <Text
              style={{
                color: "white",
                fontSize: 14,
                fontFamily: "Poppins_600SemiBold",
              }}
            >
              {item?.ratings}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <FontAwesome name="clock-o" size={16} color="#575757" />
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 12,
                color: "#575757",
              }}
            >
              {item?.duration} m
            </Text>
          </View>
        </View>
        <Text
          style={{
            fontFamily: "Poppins_700Bold",
            fontSize: 16,
            textAlign: "left",
            marginTop: 4,
            color: "#ED2B8A",
          }}
        >
          {item?.name}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontFamily: "Poppins_700Bold", fontSize: 18 }}>
              {formatRupiah(item?.price)}
            </Text>
            <Text
              style={{
                paddingLeft: 5,
                textDecorationLine: "line-through",
                fontSize: 10,
                fontFamily: "Poppins_400Regular",
              }}
            >
              {formatRupiah(item?.estimatedPrice)}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <FontAwesome name="book" size={12} color="#575757" />
            <Text
              style={{
                fontFamily: "Poppins_600SemiBold",
                fontSize: 12,
                color: "#575757",
              }}
            >
              {item?.booked}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
