import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  useFonts,
  Poppins_700Bold,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import { router } from "expo-router";

export default function SearchInput() {
  const [value, setValue] = useState("");
  const [products, setProducts] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    axios
      .get(`${SERVER_URI}/get-products`)
      .then((res) => {
        setProducts(res.data.products);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${SERVER_URI}/get-treatments`)
      .then((res) => {
        setTreatments(res.data.treatments);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const lowercasedValue = value.toLowerCase();
    const filteredProducts = products.filter((product: ProductsType) =>
      product.name.toLowerCase().includes(lowercasedValue)
    );
    const filteredTreatments = treatments.filter((treatment: TreatmentsType) =>
      treatment.name.toLowerCase().includes(lowercasedValue)
    );
    setFilteredResults([...filteredProducts, ...filteredTreatments]);
  }, [value, products, treatments]);

  const handlePress = (item: ProductsType | TreatmentsType) => {
    if ("purchased" in item) {
      router.push({
        pathname: "/(routes)/product-details",
        params: { item: JSON.stringify(item) },
      });
    } else if ("booked" in item) {
      router.push({
        pathname: "/(routes)/treatment-details",
        params: { item: JSON.stringify(item) },
      });
    }
  };

  let [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const renderItem = ({ item }: { item: ProductsType | TreatmentsType }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handlePress(item)}
    >
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Image
          source={{ uri: item?.image?.url }}
          style={{ width: 60, height: 60, borderRadius: 10 }}
        />
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemName}>Rp. {item.price.toLocaleString()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Search"
            placeholderTextColor="#575757"
            value={value}
            onChangeText={setValue}
          />
          <TouchableOpacity
            style={{ backgroundColor: "#ED2B8A", padding: 10, borderRadius: 5 }}
          >
            <Ionicons name="search" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      {value ? (
        <FlatList
          data={filteredResults}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.centerText}>
          <Text style={styles.centerTextInner}>Search</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 5,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Poppins_700Bold",
    color: "black",
    paddingVertical: 10,
    width: 271,
    height: 48,
    marginLeft: 10,
  },
  itemContainer: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 16,
    marginHorizontal: 2,
    marginVertical: 10,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  itemName: {
    fontFamily: "Poppins_600SemiBold",

    fontSize: 14,
  },
  itemDescription: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#575757",
  },
  itemPrice: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: "#ED2B8A",
  },
  centerText: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centerTextInner: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    color: "#575757",
  },
});
