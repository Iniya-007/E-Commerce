import { View,
Text,
FlatList,
Image,
TouchableOpacity,
TextInput,
ScrollView
} from "react-native";

import { useState } from "react";

import { router } from "expo-router";

const categories = [

{
id:"1",
name:"Mobile",
image:require("../../assets/images/categories/iphone.jpg")
},

{
id:"2",
name:"Laptop",
image:require("../../assets/images/categories/laptop.jpg")
},

{
id:"3",
name:"Fashion",
image:require("../../assets/images/categories/fashion.jpg")
},

{
id:"4",
name:"Beauty",
image:require("../../assets/images/categories/beauty.jpg")
},

{
id:"5",
name:"Accessories",
image:require("../../assets/images/categories/phone.jpg")
},

{
id:"6",
name:"Electronics",
image:require("../../assets/images/categories/iphone.jpg")
},

];

export default function CategoriesScreen(){

const [search,setSearch]=useState("");

const filtered =
categories.filter((item)=>

item.name
.toLowerCase()
.includes(search.toLowerCase())

);

return(

<ScrollView

style={{
flex:1,
backgroundColor:"#F5F7FB"
}}

>

<View

style={{

backgroundColor:"#1E293B",

paddingTop:50,

paddingHorizontal:20,

paddingBottom:25,

borderBottomLeftRadius:35,

borderBottomRightRadius:35

}}

>

<Text

style={{

fontSize:36,

fontWeight:"bold",

color:"white"

}}

>

Categories

</Text>

<Text

style={{

color:"#D1D5DB",

marginTop:5

}}

>

Explore Products

</Text>

</View>


<TextInput

placeholder="Search Category"

value={search}

onChangeText={setSearch}

style={{

backgroundColor:"white",

marginHorizontal:20,

marginTop:-20,

borderRadius:16,

padding:15,

elevation:4

}}

/>


<View

style={{

paddingHorizontal:15,

paddingTop:25

}}

>

<Text

style={{

fontSize:26,

fontWeight:"bold",

marginBottom:20,

color:"#111827"

}}

>

Browse Categories

</Text>


<FlatList

data={filtered}

numColumns={2}

scrollEnabled={false}

keyExtractor={(item)=>item.id}

renderItem={({item})=>(

<TouchableOpacity

onPress={() =>

router.push({

pathname:"/category/[name]",

params:{

name:item.name

}

})

}

style={{

flex:1,

backgroundColor:"white",

margin:8,

borderRadius:20,

padding:12,

alignItems:"center",

elevation:4

}}

>

<Image

source={item.image}

style={{

width:120,

height:120,

borderRadius:60

}}

/>

<Text

style={{

fontSize:18,

fontWeight:"bold",

marginTop:12,

color:"#111827"

}}

>

{item.name}

</Text>

<Text

style={{

marginTop:4,

color:"#6B7280"

}}

>

120+ Products

</Text>

</TouchableOpacity>

)}

/>

</View>

</ScrollView>

)

}