import React from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
} from "react-native";

const categories = [
  {
    name: "Mobiles",
    image: require("../assets/images/categories/phone.jpg"),
  },
  {
    name: "iPhone",
    image: require("../assets/images/categories/iphone.jpg"),
  },
  {
    name: "Laptop",
    image: require("../assets/images/categories/laptop.jpg"),
  },
  {
    name: "Fashion",
    image: require("../assets/images/categories/fashion.jpg"),
  },
  {
    name: "Beauty",
    image: require("../assets/images/categories/beauty.jpg"),
  },
];

export default function CategoryRow() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginVertical: 15 }}
    >
      {categories.map((item) => (
        <View
          key={item.name}
          style={{
            alignItems: "center",
            marginHorizontal: 10,
          }}
        >
          <Image
            source={item.image}
            style={{
              width: 70,
              height: 70,
              borderRadius: 35,
            }}
          />

          <Text
            style={{
              marginTop: 6,
              fontWeight: "600",
            }}
          >
            {item.name}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}