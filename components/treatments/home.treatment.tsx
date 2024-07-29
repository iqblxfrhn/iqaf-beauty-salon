import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import {
  useFonts,
  Poppins_700Bold,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import TreatmentCard from "../cards/treatment.card";

export default function Treatments() {
  const [treatments, setTreatments] = useState<TreatmentsType[]>([]);
  const [loading, setLoading] = useState(true);
  const flatlishRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${SERVER_URI}/get-treatments`)
      .then((res: any) => {
        setTreatments(res.data.treatments);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  let [fontsLoaded, fontError] = useFonts({
    Poppins_700Bold,
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  // Ambil 4 item pertama dari array treatments
  const limitedTreatments = treatments.slice(0, 4);

  return (
    <View style={{ flex: 1, marginTop: 20 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontFamily: "Poppins_700Bold", fontSize: 18 }}>
          Populer Treatments
        </Text>
        <TouchableOpacity onPress={() => router.push("/(routes)/treatments")}>
          <Text
            style={{
              fontFamily: "Poppins_600SemiBold",
              fontSize: 12,
              color: "#ED2B8A",
            }}
          >
            Lihat Semua
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        ref={flatlishRef}
        data={limitedTreatments}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => <TreatmentCard item={item} />}
      />
    </View>
  );
}
