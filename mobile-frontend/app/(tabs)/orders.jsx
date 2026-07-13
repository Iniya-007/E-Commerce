import {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  FlatList,
} from "react-native";

import {
  getMyOrders,
} from "../../services/order.service";

export default function OrdersScreen() {
  const [orders, setOrders] =
    useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders =
    async () => {
      try {
        const data =
          await getMyOrders();

        setOrders(data);
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) =>
        item._id
      }
      renderItem={({ item }) => (
        <View
          style={{
            padding: 15,
            margin: 10,
            borderWidth: 1,
            borderRadius: 10,
          }}
        >
          <Text>
            Order ID:
          </Text>

          <Text>
            {item._id}
          </Text>

          <Text>
            ₹
            {
              item.totalPrice
            }
          </Text>

          <Text>
            {
              item.status
            }
          </Text>
        </View>
      )}
    />
  );
}