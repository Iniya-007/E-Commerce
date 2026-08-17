import {
  useLocalSearchParams,
  router,
} from "expo-router";

import {
  useCallback,
  useState,
} from "react";

import {
  useFocusEffect,
} from "@react-navigation/native";

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";

import {
  getProductById,
} from "../../services/product.service";

import {
  getAddresses,
} from "../../services/address.service";

import {
  createOrder,
} from "../../services/order.service";


export default function BuyNow() {

  const { id } =
    useLocalSearchParams();


  const [product, setProduct] =
    useState(null);

  const [addresses, setAddresses] =
    useState([]);

  const [selectedAddress, setSelectedAddress] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [placingOrder, setPlacingOrder] =
    useState(false);


  // -----------------------------------------
  // LOAD DATA
  // -----------------------------------------

  useFocusEffect(
  useCallback(() => {
    loadData();
  }, [id])
);


  const loadData = async () => {

    try {

      setLoading(true);


      const [
        productData,
        addressData,
      ] = await Promise.all([

        getProductById(id),

        getAddresses(),

      ]);


      setProduct(
        productData
      );


      setAddresses(
        addressData || []
      );


      // ---------------------------------------
      // Select default address
      // ---------------------------------------

      const defaultAddress =
        (addressData || [])
          .find(
            (address) =>
              address.isDefault
          );


      if (defaultAddress) {

        setSelectedAddress(
          defaultAddress
        );

      } else if (
        addressData &&
        addressData.length > 0
      ) {

        setSelectedAddress(
          addressData[0]
        );
      }

    } catch (error) {

      console.log(
        "BUY NOW LOAD ERROR:",
        error.message
      );

      Alert.alert(
        "Error",
        "Unable to load checkout details."
      );

    } finally {

      setLoading(false);
    }
  };


  // -----------------------------------------
  // ADD ADDRESS
  // -----------------------------------------

  const handleAddAddress =
    () => {

      router.push(
        "/user/add-address"
      );
    };


  // -----------------------------------------
  // PLACE ORDER
  // -----------------------------------------

  const handleContinue =
    async () => {

      if (!selectedAddress) {

        Alert.alert(
          "Address Required",
          "Please select a delivery address."
        );

        return;
      }


      try {

        setPlacingOrder(true);


        const order =
          await createOrder(

            [
              {
                product:
                  product._id,

                quantity: 1,
              },
            ],

            selectedAddress._id

          );


        // -------------------------------------
        // ORDER SUCCESS
        // -------------------------------------

        router.replace({
          pathname:
            "/order-confirmed",

          params: {
            orderId:
              order._id,
          },
        });


      } catch (error) {

        console.log(
          "PLACE ORDER ERROR:",
          error?.response?.data ||
          error.message
        );


        Alert.alert(
          "Order Failed",

          error?.response?.data?.message ||
          "Unable to place order."
        );

      } finally {

        setPlacingOrder(false);
      }
    };


  // -----------------------------------------
  // LOADING
  // -----------------------------------------

  if (loading) {

    return (

      <View
        style={styles.loading}
      >

        <ActivityIndicator
          size="large"
          color="#2563EB"
        />

      </View>
    );
  }


  if (!product) {

    return (

      <View
        style={styles.loading}
      >

        <Text>
          Product not found
        </Text>

      </View>
    );
  }


  const productPrice =
    Number(product.price);


  const deliveryCharge = 0;


  const total =
    productPrice +
    deliveryCharge;


  return (

    <View
      style={styles.container}
    >

      {/* ========================================
          HEADER
      ======================================== */}

      <View
        style={styles.header}
      >

        <TouchableOpacity
          onPress={() =>
            router.back()
          }
        >

          <Text
            style={styles.back}
          >
            ←
          </Text>

        </TouchableOpacity>


        <Text
          style={styles.headerTitle}
        >
          Buy Now
        </Text>


        <View
          style={{
            width: 35,
          }}
        />

      </View>


      <ScrollView
        contentContainerStyle={{
          paddingBottom: 120,
        }}
      >

        {/* ======================================
            PRODUCT
        ====================================== */}

        <View
          style={styles.card}
        >

          <Image
            source={
              product.images?.[0]
                ? {
                    uri:
                      product.images[0],
                  }
                : require(
                    "../../assets/images/categories/iphone.jpg"
                  )
            }
            style={styles.productImage}
          />


          <View
            style={{
              flex: 1,
            }}
          >

            <Text
              style={styles.productName}
            >
              {product.name}
            </Text>


            <Text
              style={styles.productPrice}
            >
              ₹{product.price}
            </Text>


            <Text
              style={styles.quantity}
            >
              Quantity: 1
            </Text>

          </View>

        </View>


        {/* ======================================
            DELIVERY ADDRESS
        ====================================== */}

        <View
          style={styles.section}
        >

          <View
            style={styles.sectionHeader}
          >

            <Text
              style={styles.sectionTitle}
            >
              Delivery Address
            </Text>


            {addresses.length > 0 && (

              <TouchableOpacity
                onPress={
                  handleAddAddress
                }
              >

                <Text
                  style={styles.changeText}
                >
                  + Add New
                </Text>

              </TouchableOpacity>

            )}

          </View>


          {selectedAddress ? (

            <TouchableOpacity
              onPress={() => {
                /*
                 * For now we cycle through
                 * saved addresses.
                 *
                 * Later we can make a
                 * dedicated address selector.
                 */
                if (
                  addresses.length <= 1
                ) {
                  return;
                }

                const index =
                  addresses.findIndex(
                    (address) =>
                      address._id ===
                      selectedAddress._id
                  );

                const nextIndex =
                  (index + 1) %
                  addresses.length;

                setSelectedAddress(
                  addresses[nextIndex]
                );
              }}
              style={
                styles.addressCard
              }
            >

              <Text
                style={
                  styles.addressName
                }
              >
                📍 {selectedAddress.fullName}
              </Text>


              <Text
                style={
                  styles.addressText
                }
              >
                {selectedAddress.phone}
              </Text>


              <Text
                style={
                  styles.addressText
                }
              >
                {selectedAddress.addressLine1}
              </Text>


              {selectedAddress.addressLine2 ? (

                <Text
                  style={
                    styles.addressText
                  }
                >
                  {selectedAddress.addressLine2}
                </Text>

              ) : null}


              <Text
                style={
                  styles.addressText
                }
              >
                {selectedAddress.city},{" "}
                {selectedAddress.state}
              </Text>


              <Text
                style={
                  styles.addressText
                }
              >
                {selectedAddress.pincode}
              </Text>


              {addresses.length > 1 && (

                <Text
                  style={
                    styles.tapChange
                  }
                >
                  Tap to change address
                </Text>

              )}

            </TouchableOpacity>

          ) : (

            <View
              style={
                styles.noAddress
              }
            >

              <Text
                style={
                  styles.noAddressText
                }
              >
                📍 No delivery address
                added
              </Text>


              <TouchableOpacity
                onPress={
                  handleAddAddress
                }
                style={
                  styles.addAddressButton
                }
              >

                <Text
                  style={
                    styles.addAddressText
                  }
                >
                  + Add Address
                </Text>

              </TouchableOpacity>

            </View>

          )}

        </View>


        {/* ======================================
            PRICE DETAILS
        ====================================== */}

        <View
          style={styles.section}
        >

          <Text
            style={styles.sectionTitle}
          >
            Price Details
          </Text>


          <View
            style={styles.priceRow}
          >

            <Text>
              Product Price
            </Text>

            <Text>
              ₹{productPrice.toFixed(2)}
            </Text>

          </View>


          <View
            style={styles.priceRow}
          >

            <Text>
              Delivery
            </Text>

            <Text
              style={{
                color: "#16A34A",
              }}
            >
              FREE
            </Text>

          </View>


          <View
            style={styles.divider}
          />


          <View
            style={styles.totalRow}
          >

            <Text
              style={styles.totalLabel}
            >
              Total
            </Text>

            <Text
              style={styles.totalPrice}
            >
              ₹{total.toFixed(2)}
            </Text>

          </View>

        </View>

      </ScrollView>


      {/* ========================================
          BOTTOM CONTINUE
      ======================================== */}

      <View
        style={styles.bottomBar}
      >

        <View>

          <Text
            style={styles.bottomLabel}
          >
            Total
          </Text>

          <Text
            style={styles.bottomTotal}
          >
            ₹{total.toFixed(2)}
          </Text>

        </View>


        <TouchableOpacity
          onPress={handleContinue}
          disabled={
            placingOrder ||
            !selectedAddress
          }
          style={[
            styles.continueButton,

            (!selectedAddress ||
              placingOrder) &&
              styles.disabledButton,
          ]}
        >

          {placingOrder ? (

            <ActivityIndicator
              color="white"
            />

          ) : (

            <Text
              style={
                styles.continueText
              }
            >
              Continue
            </Text>

          )}

        </TouchableOpacity>

      </View>

    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F8F8FA",
  },


  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },


  header: {
    height: 65,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },


  back: {
    fontSize: 32,
    color: "#111827",
  },


  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
  },


  card: {
    backgroundColor: "white",
    margin: 15,
    padding: 15,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
  },


  productImage: {
    width: 90,
    height: 90,
    borderRadius: 14,
    marginRight: 15,
  },


  productName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },


  productPrice: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2563EB",
    marginTop: 8,
  },


  quantity: {
    marginTop: 5,
    color: "#6B7280",
  },


  section: {
    backgroundColor: "white",
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 18,
    borderRadius: 18,
  },


  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },


  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },


  changeText: {
    color: "#2563EB",
    fontWeight: "bold",
  },


  addressCard: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 14,
    padding: 15,
  },


  addressName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 5,
  },


  addressText: {
    color: "#4B5563",
    lineHeight: 21,
  },


  tapChange: {
    color: "#2563EB",
    fontWeight: "bold",
    marginTop: 10,
  },


  noAddress: {
    alignItems: "center",
    paddingVertical: 15,
  },


  noAddressText: {
    color: "#6B7280",
    fontSize: 16,
    marginBottom: 12,
  },


  addAddressButton: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },


  addAddressText: {
    color: "#2563EB",
    fontWeight: "bold",
  },


  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
    color: "#4B5563",
  },


  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 10,
  },


  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },


  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },


  totalPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2563EB",
  },


  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },


  bottomLabel: {
    color: "#6B7280",
    fontSize: 13,
  },


  bottomTotal: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#111827",
  },


  continueButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 35,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 150,
    alignItems: "center",
  },


  disabledButton: {
    opacity: 0.5,
  },


  continueText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },

});