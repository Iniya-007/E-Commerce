import {
  router,
  useLocalSearchParams,
} from "expo-router";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";


export default function OrderConfirmed() {

  const {
    orderId,
  } = useLocalSearchParams();


  return (

    <View
      style={styles.container}
    >

      <View
        style={styles.iconCircle}
      >

        <Text
          style={styles.check}
        >
          ✓
        </Text>

      </View>


      <Text
        style={styles.title}
      >
        Order Confirmed!
      </Text>


      <Text
        style={styles.message}
      >
        Your order has been placed
        successfully.
      </Text>


      {orderId && (

        <Text
          style={styles.orderId}
        >
          Order ID: {orderId}
        </Text>

      )}


      <TouchableOpacity
        onPress={() =>
          router.replace(
            "/user/orders"
          )
        }
        style={styles.button}
      >

        <Text
          style={styles.buttonText}
        >
          View My Orders
        </Text>

      </TouchableOpacity>


      <TouchableOpacity
        onPress={() =>
          router.replace(
            "/tabs/home"
          )
        }
        style={styles.secondaryButton}
      >

        <Text
          style={
            styles.secondaryText
          }
        >
          Continue Shopping
        </Text>

      </TouchableOpacity>

    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F8F8FA",
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
  },


  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },


  check: {
    fontSize: 55,
    color: "#16A34A",
    fontWeight: "bold",
  },


  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
  },


  message: {
    fontSize: 17,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 12,
  },


  orderId: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 15,
  },


  button: {
    width: "100%",
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 35,
  },


  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },


  secondaryButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },


  secondaryText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "bold",
  },

});