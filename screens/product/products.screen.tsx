import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import {
  useFonts,
  Poppins_700Bold,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { router } from "expo-router";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import ProductCard from "@/components/cards/product.card";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Loader from "@/components/loader/loader";

export default function ProductsScreen() {
  const [products, setProducts] = useState<ProductsType[]>([]);
  const [loading, setLoading] = useState(true);
  const flatlistRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${SERVER_URI}/get-products`)
      .then((res: any) => {
        setProducts(res.data.products);
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
                  Semua Produk
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
              data={products}
              keyExtractor={(item) => item._id.toString()}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              renderItem={({ item }) => <ProductCard item={item} />}
            />
          </View>
        </LinearGradient>
      )}
    </>
  );
}
