import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";

import {
  useEffect,
  useState,
} from "react";

import { router } from "expo-router";

import {
  getProducts,
} from "../../services/product.service";

import BannerCarousel from "../../components/BannerCarousel";
import CategoryRow from "../../components/CategoryRow";

export default function HomeScreen() {
  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts =
    async () => {
      try {
        const data =
          await getProducts();

        setProducts(
          data.products || data
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  const filteredProducts =
    products.filter(
      (product) =>
        product.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        style={{ flex: 1 }}
      />
    );
  }

  return (
  <FlatList
    data={filteredProducts}
    numColumns={2}
    keyExtractor={(item) => item._id}
    contentContainerStyle={{
      backgroundColor: "#F8F8FA",
      paddingBottom: 100,
    }}
    ListHeaderComponent={
      <>
        {/* HEADER */}
        <View
          style={{
            backgroundColor: "#1F2937",
            paddingTop: 55,
            paddingBottom: 25,
            paddingHorizontal: 20,
            borderBottomLeftRadius: 25,
            borderBottomRightRadius: 25,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 34,
              fontWeight: "800",
            }}
          >
            Aureva
          </Text>

          <Text
            style={{
              color: "#D4AF37",
              fontSize: 14,
              marginTop: 4,
            }}
          >
            Premium Shopping Experience
          </Text>
        </View>

        {/* SEARCH */}
        <View
          style={{
            marginHorizontal: 15,
            marginTop: -18,
          }}
        >
          <TextInput
            placeholder="Search Products..."
            value={search}
            onChangeText={setSearch}
            style={{
              backgroundColor: "white",
              height: 55,
              borderRadius: 15,
              paddingHorizontal: 20,
              elevation: 4,
            }}
          />
        </View>

        {/* OFFER CARD */}
        <View
          style={{
            marginHorizontal: 15,
            marginTop: 15,
            backgroundColor: "#FFF4D6",
            padding: 15,
            borderRadius: 15,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#D97706",
            }}
          >
            🎉 Summer Sale
          </Text>

          <Text
            style={{
              color: "#666",
              marginTop: 5,
            }}
          >
            Up to 50% OFF on Electronics
          </Text>
        </View>

        {/* CATEGORIES */}
        <CategoryRow />

        {/* BANNER */}
        <BannerCarousel />

        {/* TITLE */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginHorizontal: 15,
            marginTop: 20,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
            }}
          >
            Featured Products
          </Text>

          <Text
            style={{
              color: "#2563EB",
            }}
          >
            View All
          </Text>
        </View>
      </>
    }
    renderItem={({ item }) => (
      <TouchableOpacity
        onPress={() =>
          router.push(
            `/product/${item._id}`
          )
        }
        style={{
          flex: 1,
          backgroundColor: "white",
          margin: 8,
          borderRadius: 18,
          overflow: "hidden",
          elevation: 4,
        }}
      >
        {/* IMAGE */}
        {item.images?.[0] ? (
          <Image
            source={{
              uri: item.images[0],
            }}
            style={{
              width: "100%",
              height: 150,
            }}
            resizeMode="cover"
          />
        ) : (
          <Image
            source={require("../../assets/images/products/brace1.jpg")}
            style={{
              width: "100%",
              height: 150,
            }}
            resizeMode="cover"
          />
        )}

        {/* DISCOUNT BADGE */}
        <View
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            backgroundColor: "#10B981",
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 11,
              fontWeight: "bold",
            }}
          >
            20% OFF
          </Text>
        </View>

        <View
          style={{
            padding: 12,
          }}
        >
          <Text
            numberOfLines={2}
            style={{
              fontSize: 15,
              fontWeight: "700",
            }}
          >
            {item.name}
          </Text>

          {/* RATING */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 5,
            }}
          >
            <Text
              style={{
                color: "#F59E0B",
              }}
            >
              ⭐⭐⭐⭐⭐
            </Text>

            <Text
              style={{
                marginLeft: 5,
                color: "#666",
                fontSize: 12,
              }}
            >
              (4.8)
            </Text>
          </View>

          <Text
            style={{
              color: "#2563EB",
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 8,
            }}
          >
            ₹{item.price}
          </Text>

          <Text
            style={{
              color: "#16A34A",
              marginTop: 4,
              fontWeight: "600",
            }}
          >
            ✓ In Stock
          </Text>
        </View>
      </TouchableOpacity>
    )}
  />
);
}