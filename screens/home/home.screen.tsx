import { View, Text } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import Header from "@/components/header/header";
import SearchInput from "@/components/common/search.input";
import HomeBannerSlider from "@/components/home/home.banner.slider";
import Treatments from "@/components/treatments/home.treatment";
import Products from "@/components/products/home.product";
import { ScrollView } from "react-native-virtualized-view";

export default function HomeScreen() {
  return (
    <LinearGradient
      colors={["#FCEDF0", "#F6F7F9"]}
      style={{ flex: 1, paddingTop: 40, paddingHorizontal: 10}}
    >
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <HomeBannerSlider />
        <Treatments />
        <Products />
      </ScrollView>
    </LinearGradient>
  );
}
