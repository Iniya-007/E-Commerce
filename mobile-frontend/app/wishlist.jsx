import {
  useEffect,
  useState,
} from "react";

import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";

import {
  getWishlist,
  removeFromWishlist,
} from "../services/wishlist.service";

export default function WishlistScreen() {
  const [wishlist, setWishlist] =
    useState(null);

    useFocusEffect(

useCallback(() => {

fetchWishlist();

}, [])

);

  const fetchWishlist =
    async () => {
      try {
        const data =
          await getWishlist();

        setWishlist(data);
      } catch (error) {
        console.log(error);
      }
    };

  const handleRemove =
    async (productId) => {
      await removeFromWishlist(
        productId
      );

      fetchWishlist();
    };

  if (
    !wishlist ||
    !wishlist.products ||
    wishlist.products.length === 0
  ) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent:
            "center",
          alignItems:
            "center",
        }}
      >
        <Text>
          Wishlist Empty
        </Text>
      </View>
    );
  }

  return (

<FlatList

data={wishlist.products}

contentContainerStyle={{
padding:15
}}

keyExtractor={(item)=>item._id}

renderItem={({item})=>(

<View

style={{

backgroundColor:"white",

borderRadius:20,

overflow:"hidden",

marginBottom:20,

elevation:4

}}

>

<Image

source={{uri:item.images?.[0]}}

style={{

width:"100%",

height:220

}}

/>

<View style={{padding:15}}>

<Text

style={{

fontSize:26,

fontWeight:"bold"

}}

>

{item.name}

</Text>


<Text

style={{

fontSize:22,

fontWeight:"bold",

color:"#2563EB",

marginTop:10

}}

>

₹{item.price}

</Text>


<TouchableOpacity

onPress={()=>handleRemove(item._id)}

style={{

backgroundColor:"#EF4444",

padding:14,

borderRadius:12,

marginTop:20

}}

>

<Text

style={{

color:"white",

fontWeight:"bold",

textAlign:"center"

}}

>

Remove From Wishlist

</Text>

</TouchableOpacity>

</View>

</View>

)}

 />

);
}