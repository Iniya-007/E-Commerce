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
  getCart,
  removeFromCart,
  updateCart,
} from "../../services/cart.service";

import { Alert } from "react-native";

import {
  createOrder,
} from "../../services/order.service";

export default function CartScreen() {
  const [cart, setCart] =
    useState(null);

  useFocusEffect(
  useCallback(() => {
    fetchCart();
  }, [])
);

  const fetchCart =
    async () => {
      try {
        const data =
          await getCart();

        setCart(data);
      } catch (error) {
        console.log(error);
      }
    };

    const increaseQty =
  async (
    productId,
    quantity
  ) => {
    await updateCart(
      productId,
      quantity + 1
    );

    fetchCart();
  };

const decreaseQty =
  async (
    productId,
    quantity
  ) => {
    if (quantity <= 1)
      return;

    await updateCart(
      productId,
      quantity - 1
    );

    fetchCart();
  };

  const handleRemove =
    async (productId) => {
      await removeFromCart(
        productId
      );

      fetchCart();
    };

    const handleOrder =
  async () => {
    try {
      const items =
        cart.items.map(
          (item) => ({
            product:
              item.product._id,
            quantity:
              item.quantity,
          })
        );

      await createOrder(
        items
      );

      Alert.alert(
        "Success",
        "Order Placed"
      );

      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  if (
    !cart ||
    !cart.items ||
    cart.items.length === 0
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
          Cart Empty
        </Text>
      </View>
    );
  }

  const cartTotal =
  cart.items.reduce(
    (total, item) =>
      total +
      item.product.price *
        item.quantity,
    0
  );

 return (
  <View
    style={{
      flex: 1,
      backgroundColor: "#F8F8FA",
    }}
  >
    <Text
      style={{
        fontSize: 30,
        fontWeight: "bold",
        marginTop: 50,
        marginHorizontal: 20,
        marginBottom: 15,
      }}
    >
      My Cart
    </Text>

    <FlatList
      data={cart.items}
      keyExtractor={(item) =>
        item.product._id
      }
      contentContainerStyle={{
        paddingBottom: 200,
      }}
      renderItem={({ item }) => (
        <View
          style={{
            backgroundColor: "white",
            marginHorizontal: 15,
            marginBottom: 15,
            borderRadius: 18,
            overflow: "hidden",
            elevation: 3,
          }}
        >
          {/* IMAGE */}
          <Image
            source={
              item.product.images?.[0]
                ? {
                    uri:
                      item.product
                        .images[0],
                  }
                : require("../../assets/images/categories/laptop.jpg")
            }
            style={{
              width: "100%",
              height: 180,
            }}
            resizeMode="cover"
          />

          <View
            style={{
              padding: 15,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {item.product.name}
            </Text>

            <Text
              style={{
                color: "#F59E0B",
                marginTop: 5,
              }}
            >
              ⭐⭐⭐⭐⭐ (4.8)
            </Text>

            <Text
              style={{
                fontSize: 24,
                color: "#2563EB",
                fontWeight: "bold",
                marginTop: 10,
              }}
            >
              ₹{item.product.price}
            </Text>

            <Text
              style={{
                color: "#16A34A",
                marginTop: 5,
              }}
            >
              ✓ In Stock
            </Text>

            {/* QUANTITY */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 15,
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  decreaseQty(
                    item.product._id,
                    item.quantity
                  )
                }
                style={{
                  backgroundColor:
                    "#E5E7EB",
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  justifyContent:
                    "center",
                  alignItems:
                    "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight:
                      "bold",
                  }}
                >
                  -
                </Text>
              </TouchableOpacity>

              <Text
                style={{
                  marginHorizontal:
                    20,
                  fontSize: 18,
                  fontWeight:
                    "bold",
                }}
              >
                {item.quantity}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  increaseQty(
                    item.product._id,
                    item.quantity
                  )
                }
                style={{
                  backgroundColor:
                    "#2563EB",
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  justifyContent:
                    "center",
                  alignItems:
                    "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    color: "white",
                    fontWeight:
                      "bold",
                  }}
                >
                  +
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() =>
                handleRemove(
                  item.product._id
                )
              }
              style={{
                marginTop: 15,
              }}
            >
              <Text
                style={{
                  color: "red",
                  fontWeight:
                    "bold",
                }}
              >
                Remove
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />

    {/* ORDER SUMMARY */}
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        padding: 20,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        elevation: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent:
            "space-between",
        }}
      >
        <Text
          style={{
            color: "#6B7280",
          }}
        >
          Subtotal
        </Text>

        <Text>
          ₹{cartTotal}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent:
            "space-between",
          marginTop: 5,
        }}
      >
        <Text
          style={{
            color: "#6B7280",
          }}
        >
          Delivery
        </Text>

        <Text
          style={{
            color: "green",
          }}
        >
          FREE
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent:
            "space-between",
          marginTop: 10,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
          }}
        >
          Total
        </Text>

        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: "#2563EB",
          }}
        >
          ₹{cartTotal}
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleOrder}
        style={{
          backgroundColor:
            "#2563EB",
          padding: 18,
          borderRadius: 15,
          marginTop: 15,
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign:
              "center",
            fontSize: 18,
            fontWeight:
              "bold",
          }}
        >
          Proceed To Checkout
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);
}