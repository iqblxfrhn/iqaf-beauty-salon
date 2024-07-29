import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Button,
} from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  useFonts,
  Poppins_700Bold,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import ProductReviewCard from "@/components/cards/product.review.card";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProductDetailScreen() {
  let [fontsLoaded, fontError] = useFonts({
    Poppins_700Bold,
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  const formatRupiah = (number: number) => {
    return "Rp." + number.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const { item } = useLocalSearchParams();

  const productDetail: ProductsType = JSON.parse(item as string);

  const ratings = productDetail?.ratings ?? 0;
  const maxStars = 5;

  const handleAddToCart = async () => {
    const existingCartData = await AsyncStorage.getItem("cart");
    const cartData = existingCartData ? JSON.parse(existingCartData) : [];

    const existingProductIndex = cartData.findIndex(
      (product: ProductsType) => product._id === productDetail._id
    );

    if (existingProductIndex >= 0) {
      cartData[existingProductIndex].quantity += 1;
    } else {
      productDetail.quantity = 1;
      cartData.push(productDetail);
    }

    await AsyncStorage.setItem("cart", JSON.stringify(cartData));
    router.push("/(routes)/cart");
  };

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <LinearGradient colors={["#FCEDF0", "#F6F7F9"]} style={{ flex: 1 }}>
      <View style={{ marginTop: 40, paddingHorizontal: 10 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <TouchableWithoutFeedback onPress={() => router.back()}>
            <Entypo
              name="chevron-thin-left"
              size={20}
              color="black"
              style={{}}
            />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => router.push("/(routes)/cart")}
          >
            <Feather name="shopping-bag" size={24} color="black" style={{}} />
          </TouchableWithoutFeedback>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          <View style={{ marginTop: 15 }}>
            <Image
              source={{ uri: productDetail?.image.url! }}
              style={{ width: "100%", height: 213, borderRadius: 16 }}
            />
            <Text
              style={{
                fontFamily: "Poppins_700Bold",
                fontSize: 20,
                textAlign: "left",
                marginTop: 8,
                color: "#ED2B8A",
              }}
            >
              {productDetail?.name}
            </Text>
          </View>
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
                gap: 4,
                marginBottom: 4,
              }}
            >
              {Array.from({ length: maxStars }).map((_, index) => {
                let iconName: "star" | "star-half" | "star-o" = "star";
                if (index > ratings && index < ratings + 0.5) {
                  iconName = "star-half";
                } else if (index >= ratings) {
                  iconName = "star-o";
                }
                return (
                  <FontAwesome
                    key={index}
                    name={iconName}
                    size={16}
                    color={index < ratings ? "#ffb800" : "#transparent"}
                  />
                );
              })}
              <Text
                style={{
                  color: "#575757",
                  fontSize: 16,
                  fontFamily: "Poppins_600SemiBold",
                  top: -2,
                  marginLeft: 4,
                }}
              >
                {productDetail?.ratings}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <FontAwesome name="shopping-cart" size={12} color="#575757" />
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 12,
                  color: "#575757",
                  top: 2,
                }}
              >
                {productDetail?.purchased} Terjual
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: -4,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  fontFamily: "Poppins_700Bold",
                  fontSize: 24,
                  color: "#ED2B8A",
                }}
              >
                {formatRupiah(productDetail?.price)}
              </Text>
              <Text
                style={{
                  paddingLeft: 5,
                  textDecorationLine: "line-through",
                  fontSize: 12,
                  fontFamily: "Poppins_400Regular",
                }}
              >
                {formatRupiah(productDetail?.estimatedPrice)}
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: 6 }}>
              <MaterialIcons name="inventory" size={12} color="#575757" />
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 12,
                  color: "#575757",
                  top: -1,
                }}
              >
                {productDetail?.stock} Stok
              </Text>
            </View>
          </View>
          <View style={{ marginTop: 4 }}>
            <Text
              style={{
                fontFamily: "Poppins_700Bold",
                fontSize: 20,
                textAlign: "left",
                color: "#000",
              }}
            >
              Deskripsi Produk
            </Text>
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
                fontSize: 14,
                textAlign: "justify",
                color: "#575757",
              }}
            >
              {productDetail?.description}
            </Text>
          </View>
          <View style={{ marginTop: 8 }}>
            <Text
              style={{
                fontFamily: "Poppins_700Bold",
                fontSize: 20,
                textAlign: "left",
                color: "#000",
                marginTop: 10,
              }}
            >
              Reviews
            </Text>
            <View style={{ marginTop: 4 }}>
              {productDetail?.reviews.map((item: ReviewType, index: number) => (
                <ProductReviewCard item={item} key={index} />
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: "#ED2B8A",
          height: 45,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => handleAddToCart()}
      >
        <Text
          style={{
            fontFamily: "Poppins_600SemiBold",
            fontSize: 16,
            color: "#fff",
          }}
        >
          Masukan Keranjang
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}
