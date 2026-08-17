import {
View,
Text,
FlatList,
Image,
TouchableOpacity
} from "react-native";

import {
useEffect,
useState
} from "react";

import {
useLocalSearchParams,
router
} from "expo-router";

import {
getProducts
} from "../../services/product.service";


export default function CategoryProducts(){

const { name } = useLocalSearchParams();

const [products,setProducts]=useState([]);

const [loading,setLoading]=useState(true);


useEffect(()=>{

fetchProducts();

},[]);


const fetchProducts = async()=>{

try{

const data =
await getProducts();

const allProducts =
data.products || data;

allProducts.forEach(product => {

/*console.log(
product.name,
product.category
);*/

});


const filtered = allProducts.filter((product) => {

  if (!product.category) return false;

  return (
    product.category.name
      ?.trim()
      .toLowerCase()

    ===

    name
      ?.trim()
      .toLowerCase()
  );

});

/*console.log("Selected Category:", name);

console.log("Filtered Products:", filtered);*/

setProducts(filtered);

}

catch(error){

console.log(error);

}

finally{

setLoading(false);

}

};


return(

<View

style={{

flex:1,

backgroundColor:"#F5F7FB"

}}

>

<View

style={{

backgroundColor:"#1E293B",

paddingTop:50,

paddingBottom:25,

paddingHorizontal:20,

borderBottomLeftRadius:30,

borderBottomRightRadius:30

}}

>

<Text

style={{

fontSize:32,

fontWeight:"bold",

color:"white"

}}

>

{name}

</Text>

<Text

style={{

color:"#CBD5E1"

}}

>

Products

</Text>

</View>


<FlatList

data={products}

numColumns={2}

contentContainerStyle={{

padding:10

}}

keyExtractor={(item)=>

item._id

}

renderItem={({item})=>(

<TouchableOpacity

onPress={()=>

router.push(

`/product/${item._id}`

)

}

style={{

flex:1,

backgroundColor:"white",

margin:8,

borderRadius:18,

overflow:"hidden",

elevation:3

}}

>

<Image

source={{

uri:

item.images?.[0]

}}

style={{

width:"100%",

height:150

}}

/>


<View style={{

padding:12

}}

>

<Text

numberOfLines={1}

style={{

fontSize:18,

fontWeight:"bold"

}}

>

{item.name}

</Text>


<Text

style={{

color:"#2563EB",

fontSize:20,

fontWeight:"bold",

marginTop:6

}}

>

₹{item.price}

</Text>


<Text

style={{

color:"#16A34A",

marginTop:4

}}

>

In Stock

</Text>

</View>

</TouchableOpacity>

)}

/>

</View>

);

}