import { View, Text, Image } from "react-native";
import React from "react";
import {
  useFonts,
  Poppins_700Bold,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import Swiper from "react-native-swiper";
import { bannerData } from "@/constants/constants";
export default function HomeBannerSlider() {
  let [fontsLoaded, fontError] = useFonts({
    Poppins_700Bold,
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }
  return (
    <View style={{ marginTop: 12, height: 141, borderRadius: 10 }}>
      <Swiper
        dotStyle={{
          backgroundColor: "#C6C7CC",
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 3,
          top: 20
        }}
        activeDotStyle={{
          backgroundColor: "#ED2B8A",
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 3,
          top: 20
        }}
        autoplay={true}
        autoplayTimeout={5}
      >
        {bannerData.map((item: BannerDataTypes, index: number) => (
          <View key={index} style={{ flex: 1 }}>
            <Image
              source={item.bannerImagerUrl!}
              style={{ width: 340, height: 141, borderRadius: 10 }}
            />
          </View>
        ))}
      </Swiper>
    </View>
  );
}
