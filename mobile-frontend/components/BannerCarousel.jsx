import React from "react";
import { Dimensions, Image } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const width = Dimensions.get("window").width;

const banners = [
  require("../assets/images/banners/banner1.jpg"),
  require("../assets/images/banners/banner2.jpg"),
  require("../assets/images/banners/banner3.jpg"),
];

export default function BannerCarousel() {
  return (
    <Carousel
      loop
      autoPlay
      width={width}
      height={180}
      data={banners}
      scrollAnimationDuration={1000}
      autoPlayInterval={3000}
      renderItem={({ item }) => (
        <Image
          source={item}
          style={{
            width: width - 20,
            height: 180,
            borderRadius: 15,
            alignSelf: "center",
          }}
          resizeMode="cover"
        />
      )}
    />
  );
}