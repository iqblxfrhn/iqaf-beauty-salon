import { View, Text, Image } from "react-native";
import React from "react";
import {
  useFonts,
  Poppins_700Bold,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { LinearGradient } from "expo-linear-gradient";
import AppIntroSlider from "react-native-app-intro-slider";
import { onBoardingSwiperData } from "@/constants/constants";
import { router } from "expo-router";

export default function WelcomeIntroScreen() {
  let [fontsLoaded, fontError] = useFonts({
    Poppins_700Bold,
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const renderItem = ({ item }: { item: onBoardingSwiperDataType }) => (
    <LinearGradient colors={["#FCEDF0", "#F6F7F9"]} style={{ flex: 1 }}>
      <View style={{ marginHorizontal: 20, alignItems: "center" }}>
        <Image
          source={item.image}
          style={{
            alignSelf: "center",
            marginBottom: 30,
            width: 350,
            height: 233,
            marginTop: 130,
          }}
        />
        <Text
          style={{
            fontFamily: "Poppins_700Bold",
            fontSize: 24,
            textAlign: "center",
            color: "#ED2B8A",
          }}
        >
          {item.title}
        </Text>
        <View style={{ marginTop: 15 }}>
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 16,
              textAlign: "center",
              color: "#575757"
            }}
          >
            {item.description}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
  return (
    <AppIntroSlider
      renderItem={renderItem}
      data={onBoardingSwiperData}
      onDone={() => router.push("/login")}
      onSkip={() => router.push("/login")}
      renderNextButton={() => (
        <View
          style={{
            paddingVertical: 18,
            borderRadius: 4,
            marginTop: 40,
            backgroundColor: "#ED2B8A",
            width: 327,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 16,
              textAlign: "center",
              color: "white",
            }}
          >
            Berikutnya
          </Text>
        </View>
      )}
      renderDoneButton={() => (
        <View
          style={{
            paddingVertical: 18,
            borderRadius: 4,
            marginTop: 40,
            backgroundColor: "#ED2B8A",
            width: 327,
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 16,
              textAlign: "center",
              color: "white",
            }}
          >
            Masuk Untuk Login
          </Text>
        </View>
      )}
      showSkipButton={false}
      dotStyle={{
        backgroundColor: "#FFB5C2",
      }}
      bottomButton={true}
      activeDotStyle={{
        backgroundColor: "#ED2B8A",
      }}
    />
  );
}
