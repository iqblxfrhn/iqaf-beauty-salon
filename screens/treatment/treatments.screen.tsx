import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import {
  useFonts,
  Poppins_700Bold,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';
import { router } from 'expo-router';
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Loader from '@/components/loader/loader';
import AllTreatmentCard from '@/components/cards/all.treatments.card';

export default function TreatmentsScreen() {
  const [treatments, setTreatments] = useState<TreatmentsType[]>([]);
  const [loading, setLoading] = useState(true);
  const flatlistRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${SERVER_URI}/get-treatments`)
      .then((res: any) => {
        setTreatments(res.data.treatments);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
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

  return (
    <>
    {loading ? (
      <Loader />
    ) : (
      <LinearGradient colors={["#FCEDF0", "#F6F7F9"]} style={{ flex: 1 }}>
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 40,
            paddingBottom: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity onPress={() => router.push("/(tabs)")}>
                <Ionicons
                  name="chevron-back"
                  size={24}
                  style={{ color: "#000" }}
                />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "Poppins_700Bold",
                  color: "#000",
                }}
              >
                Semua Treatment
              </Text>
            </View>
            <Image
              source={require("@/assets/logo.png")}
              style={{ width: 30, height: 30 }}
            />
          </View>
        </View>
        <View style={{ flex: 1, paddingHorizontal: 10 }}>
          <FlatList
            ref={flatlistRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 10 }}
            data={treatments}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => <AllTreatmentCard item={item} />}
          />
        </View>
      </LinearGradient>
    )}
  </>
  );
}
