import { View, Text, TouchableOpacity, FlatList } from "react-native";
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
import ProductCard from "../cards/product.card";

export default function Products() {
  const [products, setProducts] = useState<ProductsType[]>([]);
  const [loading, setLoading] = useState(true);
  const flatlistRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${SERVER_URI}/get-products`)
      .then((res: any) => {
        setProducts(res.data.products);
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

  // Ambil 6 item pertama dari array products
  const limitedProducts = products.slice(0, 6);

  return (
    <View style={{ flex: 1, marginTop: 10, marginBottom: 15 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontFamily: "Poppins_700Bold", fontSize: 18 }}>
          Populer Products
        </Text>
        <TouchableOpacity onPress={() => router.push("/(routes)/products")}>
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
        ref={flatlistRef}
        data={limitedProducts}
        keyExtractor={(item) => item._id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => <ProductCard item={item} />}
      />
    </View>
  );
}
