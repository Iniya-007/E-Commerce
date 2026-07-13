import {
  useLocalSearchParams,
} from "expo-router";

import {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  ActivityIndicator,
  Image
} from "react-native";

import {
  getProductById,
} from "../../services/product.service";

import {
  TouchableOpacity,
  Alert,
} from "react-native";

import {
  addToCart,
} from "../../services/cart.service";

import {
  addToWishlist,
} from "../../services/wishlist.service";

export default function ProductDetails() {
  const { id } =
    useLocalSearchParams();

  const [product, setProduct] =
    useState(null);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct =
    async () => {
      try {
        const data =
          await getProductById(id);

        setProduct(data);
      } catch (error) {
        console.log(error);
      }
    };

  if (!product) {
    return (
      <ActivityIndicator
        size="large"
      />
    );
  }

  const handleAddToCart =
  async () => {
    try {
      await addToCart(
        product._id,
        1
      );

      Alert.alert(
        "Success",
        "Added To Cart"
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleWishlist =
  async () => {
    try {
      await addToWishlist(
        product._id
      );

      Alert.alert(
        "Success",
        "Added To Wishlist"
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
  <View
    style={{
      flex: 1,
      backgroundColor: "#F8F8FA",
    }}
  >
    {/* PRODUCT IMAGE */}
    <View
      style={{
        backgroundColor: "white",
        padding: 20,
        alignItems: "center",
      }}
    >
      <Image
        source={
          product.images?.[0]
            ? { uri: product.images[0] }
            : require("../../assets/images/categories/iphone.jpg")
        }
        style={{
          width: 300,
          height: 300,
          borderRadius: 20,
        }}
        resizeMode="cover"
      />
    </View>

    {/* DETAILS */}
    <View
      style={{
        flex: 1,
        padding: 20,
      }}
    >
      {/* PRODUCT NAME */}
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          color: "#111827",
        }}
      >
        {product.name}
      </Text>

      {/* RATING */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 8,
        }}
      >
        <Text
          style={{
            color: "#F59E0B",
            fontSize: 18,
          }}
        >
          ⭐⭐⭐⭐⭐
        </Text>

        <Text
          style={{
            marginLeft: 8,
            color: "#6B7280",
          }}
        >
          4.8 (125 Reviews)
        </Text>
      </View>

      {/* PRICE */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 15,
        }}
      >
        <Text
          style={{
            fontSize: 32,
            color: "#2563EB",
            fontWeight: "bold",
          }}
        >
          ₹{product.price}
        </Text>

        <Text
          style={{
            marginLeft: 10,
            textDecorationLine:
              "line-through",
            color: "#9CA3AF",
            fontSize: 18,
          }}
        >
          ₹{Math.round(
            product.price * 1.25
          )}
        </Text>
      </View>

      {/* DISCOUNT */}
      <Text
        style={{
          color: "#10B981",
          fontWeight: "bold",
          marginTop: 5,
        }}
      >
        20% OFF
      </Text>

      {/* STOCK */}
      <Text
        style={{
          color: "#16A34A",
          marginTop: 10,
          fontWeight: "600",
        }}
      >
        ✓ {product.stock} Items Available
      </Text>

      {/* DESCRIPTION */}
      <Text
        style={{
          marginTop: 25,
          fontSize: 22,
          fontWeight: "bold",
        }}
      >
        Description
      </Text>

      <Text
        style={{
          marginTop: 10,
          color: "#4B5563",
          lineHeight: 24,
        }}
      >
        {product.description}
      </Text>
    </View>

    {/* BUTTONS */}
    <View
      style={{
        flexDirection: "row",
        padding: 15,
        backgroundColor: "white",
      }}
    >
      <TouchableOpacity
        onPress={handleWishlist}
        style={{
          flex: 1,
          backgroundColor: "#7C3AED",
          padding: 15,
          borderRadius: 12,
          marginRight: 8,
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          ❤️ Wishlist
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleAddToCart}
        style={{
          flex: 1,
          backgroundColor: "#2563EB",
          padding: 15,
          borderRadius: 12,
          marginLeft: 8,
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          🛒 Add To Cart
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);
}