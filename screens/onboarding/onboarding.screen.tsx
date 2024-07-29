import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import {
  useFonts,
  Poppins_700Bold,
  Poppins_400Regular,
  Poppins_600SemiBold
} from "@expo-google-fonts/poppins";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

export default function OnBoardingScreen() {
  let [fontsLoaded, fontError] = useFonts({
    Poppins_700Bold,
    Poppins_400Regular,
    Poppins_600SemiBold
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }
  return (
    <LinearGradient
      colors={["#FCEDF0", "#F6F7F9"]}
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <View style={{ alignItems: "center", marginHorizontal: 20 }}>
        <View>
          <Image
            source={require("@/assets/logo.png")}
            style={{ width: 199, height: 216 }}
          />
        </View>
        <View style={{ flexDirection: "column", marginTop: 20 }}>
          <Text
            style={{
              fontFamily: "Poppins_700Bold",
              fontSize: 22,
              textAlign: "center",
            }}
          >
            Selamat Datang di
          </Text>
          <Text
            style={{
              fontFamily: "Poppins_700Bold",
              fontSize: 32,
              textAlign: "center",
              marginTop: -10,
              color: "#ED2B8A",
            }}
          >
            Iqaf Beauty Salon
          </Text>
          <Text
            style={{
              textAlign: "center",
              color: "#575757",
              fontFamily: "Poppins_400Regular",
              fontSize: 15,
            }}
          >
            Nikmati layanan kecantikan terbaik hanya dalam genggaman Anda.
            Temukan perawatan eksklusif dan produk kecantikan berkualitas
            tinggi.
          </Text>
        </View>
        <TouchableOpacity
        onPress={() => router.push("/(routes)/welcome-intro")}
          style={{
            paddingVertical: 15,
            borderRadius: 4,
            marginTop: 40,
            backgroundColor: "#ED2B8A",
            width: 317,
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontFamily: "Poppins_600SemiBold",
              fontSize: 20,
            }}
          >
            Mulai Sekarang
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
