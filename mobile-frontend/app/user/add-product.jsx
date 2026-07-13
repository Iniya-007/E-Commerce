import { useState } from "react";

import {
View,
Text,
TextInput,
TouchableOpacity,
ScrollView,
Image,
Alert
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import { Picker } from "@react-native-picker/picker";

import axios from "axios";

export default function AddProduct() {

const BASE_URL =
"http://10.85.169.71:5000/api";

const [name, setName] =
useState("");

const [description,
setDescription] =
useState("");

const [price, setPrice] =
useState("");

const [stock, setStock] =
useState("");

const [category,
setCategory] =
useState("");

const [image, setImage] =
useState(null);



const pickImage =
async () => {

const result =
await ImagePicker.launchImageLibraryAsync({

mediaTypes:
ImagePicker.MediaTypeOptions.Images,

allowsEditing: true,

quality: 1

});

if (!result.canceled) {

setImage(
result.assets[0]
);

}

};



const uploadImage =
async () => {

if (!image)
return "";

const formData =
new FormData();

formData.append(

"image",

{

uri: image.uri,

name: "photo.jpg",

type: "image/jpeg"

}

);

const response =
await axios.post(

`${BASE_URL}/products/upload-image`,

formData,

{

headers: {

"Content-Type":

"multipart/form-data"

}

}

);

return response.data.imageUrl;

};



const saveProduct = async () => {

try{

console.log("Saving Product");

const imageUrl =
await uploadImage();

console.log(imageUrl);

const product = {

name,

description,

price:Number(price),

stock:Number(stock),

category,

images:[imageUrl]

};

console.log(product);

const response =

await axios.post(

`${BASE_URL}/products`,

product

);

console.log(response.data);

Alert.alert(

"Success",

"Product Added"

);

}

catch(error){

console.log(error);

console.log(

error.response?.data

);

Alert.alert(

"Error",

JSON.stringify(

error.response?.data

)

);

}

};



return (

<ScrollView

style={{

flex:1,

backgroundColor:"#F5F7FB"

}}

>

<View

style={{

padding:20,

paddingTop:50

}}

>

<Text

style={{

fontSize:28,

fontWeight:"bold",

marginBottom:25

}}

>

Add Product

</Text>



<TextInput

placeholder="Product Name"

value={name}

onChangeText={setName}

style={{

backgroundColor:"white",

padding:15,

borderRadius:12,

marginBottom:15

}}

/>



<TextInput

placeholder="Description"

value={description}

onChangeText={setDescription}

multiline

style={{

backgroundColor:"white",

padding:15,

borderRadius:12,

height:120,

marginBottom:15

}}

/>



<TextInput

placeholder="Price"

keyboardType="numeric"

value={price}

onChangeText={setPrice}

style={{

backgroundColor:"white",

padding:15,

borderRadius:12,

marginBottom:15

}}

/>



<TextInput

placeholder="Stock"

keyboardType="numeric"

value={stock}

onChangeText={setStock}

style={{

backgroundColor:"white",

padding:15,

borderRadius:12,

marginBottom:15

}}

/>



<View

style={{

backgroundColor:"white",

borderRadius:12,

marginBottom:20

}}

>

<Picker

selectedValue={category}

onValueChange={(itemValue)=>

setCategory(itemValue)

}

>

<Picker.Item

label="Select Category"

value=""

/>

<Picker.Item

label="Mobile"

value="6a2b7c3c01e7b0ab05ac1b54"

/>

<Picker.Item

label="Laptop"

value="6a2b7c7e01e7b0ab05ac1b55"

/>

</Picker>

</View>



<TouchableOpacity

onPress={pickImage}

style={{

backgroundColor:"#2874F0",

padding:18,

borderRadius:12,

marginBottom:20

}}

>

<Text

style={{

color:"white",

textAlign:"center",

fontWeight:"600"

}}

>

Choose Image

</Text>

</TouchableOpacity>



{

image && (

<Image

source={{

uri:image.uri

}}

style={{

width:180,

height:180,

borderRadius:12,

alignSelf:"center",

marginBottom:20

}}

/>

)

}



<TouchableOpacity

onPress={saveProduct}

style={{

backgroundColor:"#16A34A",

padding:18,

borderRadius:12

}}

>

<Text

style={{

color:"white",

textAlign:"center",

fontSize:17,

fontWeight:"600"

}}

>

Save Product

</Text>

</TouchableOpacity>



</View>

</ScrollView>

);

}