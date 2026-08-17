import {
  useLocalSearchParams,
  router,
} from "expo-router";

import {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  StyleSheet,
} from "react-native";

import {
  getProductById,
} from "../../services/product.service";

import {
  addToCart,
} from "../../services/cart.service";

import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "../../services/wishlist.service";

import {
  createOrder,
} from "../../services/order.service";

import {
  tryOnProduct,
} from "../../services/vton.service";


export default function ProductDetails() {

  const { id } =
    useLocalSearchParams();


  // -------------------------------------------------------
  // Product
  // -------------------------------------------------------

  const [product, setProduct] =
    useState(null);


  // -------------------------------------------------------
  // Wishlist
  // -------------------------------------------------------

  const [isWishlisted, setIsWishlisted] =
    useState(false);


  // -------------------------------------------------------
  // Buy Now modal
  // -------------------------------------------------------

  const [showBuyNow, setShowBuyNow] =
    useState(false);

  const [buying, setBuying] =
    useState(false);


    // -------------------------------------------------------
// Virtual Try-On
// -------------------------------------------------------

const [showTryOn, setShowTryOn] =
  useState(false);

const [tryOnLoading, setTryOnLoading] =
  useState(false);

const [tryOnImage, setTryOnImage] =
  useState(null);


  // -------------------------------------------------------
  // Load product
  // -------------------------------------------------------

  useEffect(() => {
    fetchProduct();
  }, [id]);


  const fetchProduct = async () => {

    try {

      const data =
        await getProductById(id);

      setProduct(data);


      // -----------------------------------------------
      // Check wishlist status
      // -----------------------------------------------

      try {

        const wishlist =
          await getWishlist();

        /*
         * Depending on your backend response,
         * wishlist may be:
         *
         * [
         *   { product: {...} }
         * ]
         *
         * or
         *
         * {
         *   products: [...]
         * }
         */

        const wishlistItems =
          Array.isArray(wishlist)
            ? wishlist
            : wishlist?.products || [];

        const exists =
          wishlistItems.some((item) => {

            const wishlistProduct =
              item.product || item;

            const wishlistProductId =
              wishlistProduct?._id ||
              wishlistProduct?.id;

            return (
              wishlistProductId ===
              data._id
            );
          });

        setIsWishlisted(exists);

      } catch (wishlistError) {

        // Wishlist check should not prevent
        // product page from loading.

        console.log(
          "Wishlist check failed"
        );
      }

    } catch (error) {

      console.log(
        "Product loading failed:",
        error.message
      );
    }
  };


  // -------------------------------------------------------
  // Loading
  // -------------------------------------------------------

  if (!product) {

    return (
      <View style={styles.loadingContainer}>

        <ActivityIndicator
          size="large"
          color="#2563EB"
        />

      </View>
    );
  }


  // -------------------------------------------------------
  // Add to Cart
  // -------------------------------------------------------

  const handleAddToCart =
    async () => {

      try {

        await addToCart(
          product._id,
          1
        );

        Alert.alert(
          "Added to Cart",
          `${product.name} has been added to your cart.`
        );

      } catch (error) {

        Alert.alert(
          "Error",
          "Unable to add product to cart."
        );

        console.log(
          "Add to cart error:",
          error.message
        );
      }
    };


  // -------------------------------------------------------
  // Wishlist toggle
  // -------------------------------------------------------

  const handleWishlist =
    async () => {

      try {

        if (isWishlisted) {

          await removeFromWishlist(
            product._id
          );

          setIsWishlisted(false);

        } else {

          await addToWishlist(
            product._id
          );

          setIsWishlisted(true);
        }

      } catch (error) {

        console.log(
          "Wishlist error:",
          error.message
        );

        Alert.alert(
          "Error",
          "Unable to update wishlist."
        );
      }
    };


  // -------------------------------------------------------
  // BUY NOW
  // -------------------------------------------------------
  //
  // IMPORTANT:
  // We DON'T immediately create an order.
  //
  // First open the AI recommendation UI.
  // -------------------------------------------------------

  const handleBuyNow =
    () => {

      setShowBuyNow(true);
    };


  // -------------------------------------------------------
  // Continue purchase
  // -------------------------------------------------------

  const handleProceedToBuy = () => {

  setShowBuyNow(false);

  router.push({
    pathname: "/buy-now/[id]",
    params: {
      id: product._id,
    },
  });
};


// -------------------------------------------------------
// VIRTUAL TRY-ON
// -------------------------------------------------------

const handleTryOn = async () => {
  try {
    setTryOnLoading(true);
    setTryOnImage(null);
    setShowTryOn(true);

    console.log(
      "Starting Virtual Try-On..."
    );

    const result =
      await tryOnProduct(product._id);


    console.log("========== VTON FRONTEND RESULT ==========");
console.log("Success:", result?.success);
console.log("Has image:", !!result?.image);
console.log("Image type:", typeof result?.image);
console.log("Image length:", result?.image?.length);
console.log("Image prefix:", result?.image?.substring?.(0, 50));
console.log("==========================================");

    console.log(
      "VTON result:",
      result?.success
    );

    if (!result?.success || !result?.image) {
      throw new Error(
        result?.message ||
        "Virtual Try-On failed"
      );
    }

    setTryOnImage(result.image);

  } catch (error) {

    console.log(
      "VTON frontend error:",
      error?.response?.data ||
      error.message
    );

    setShowTryOn(false);

    Alert.alert(
      "Virtual Try-On",
      error?.response?.data?.message ||
      error.message ||
      "Unable to generate Virtual Try-On."
    );

  } finally {
    setTryOnLoading(false);
  }
};

  // -------------------------------------------------------
  // AI values
  // -------------------------------------------------------

  const hasPrediction =
    Number.isFinite(
      Number(product.aiSuggestedPrice)
    ) &&
    Number(product.aiSuggestedPrice) > 0;


  const predictedPrice =
    Number(product.aiSuggestedPrice || 0);


  const changePercent =
    Number(product.priceChangePercent || 0);


  const recommendation =
    product.priceRecommendation ||
    "STABLE";


  const advice =
    product.priceAdvice ||
    "Price is expected to remain relatively stable.";


  // -------------------------------------------------------
  // Recommendation display
  // -------------------------------------------------------

  const getRecommendationTitle = () => {

    if (recommendation === "BUY_NOW") {
      return "BUY NOW";
    }

    if (recommendation === "WAIT") {
      return "WAIT";
    }

    return "STABLE";
  };


  const getRecommendationIcon = () => {

    if (recommendation === "BUY_NOW") {
      return "📈";
    }

    if (recommendation === "WAIT") {
      return "📉";
    }

    return "📊";
  };


  return (

    <View style={styles.container}>

      {/* ==================================================
          PRODUCT IMAGE
      ================================================== */}

      <View style={styles.imageContainer}>

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
          resizeMode="cover"
        />

      </View>


      {/* ==================================================
          PRODUCT DETAILS
      ================================================== */}

      <View style={styles.detailsContainer}>

        {/* -----------------------------------------------
            PRODUCT NAME + HEART
        ----------------------------------------------- */}

        <View style={styles.titleRow}>

          <Text style={styles.productName}>
            {product.name}
          </Text>


          {/* HEART */}
          <TouchableOpacity
            onPress={handleWishlist}
            style={styles.heartButton}
            activeOpacity={0.7}
          >

            <Text
              style={[
                styles.heartIcon,
                isWishlisted &&
                  styles.heartActive,
              ]}
            >
              {isWishlisted
                ? "♥"
                : "♡"}
            </Text>

          </TouchableOpacity>

        </View>


        {/* -----------------------------------------------
            RATING
        ----------------------------------------------- */}

        <View style={styles.ratingRow}>

          <Text style={styles.stars}>
            ⭐⭐⭐⭐⭐
          </Text>

          <Text style={styles.reviewText}>
            {product.averageRating || 0}
            {" "}
            ({product.numReviews || 0} Reviews)
          </Text>

        </View>


        {/* -----------------------------------------------
            PRICE
        ----------------------------------------------- */}

        <View style={styles.priceRow}>

          <Text style={styles.currentPrice}>
            ₹{product.price}
          </Text>

          <Text style={styles.oldPrice}>
            ₹
            {Math.round(
              Number(product.price) * 1.25
            )}
          </Text>

        </View>


        {/* -----------------------------------------------
            DISCOUNT
        ----------------------------------------------- */}

        {product.discount > 0 && (

          <Text style={styles.discount}>
            {product.discount}% OFF
          </Text>

        )}


        {/* -----------------------------------------------
            STOCK
        ----------------------------------------------- */}

        <Text style={styles.stock}>
          ✓ {product.stock} Items Available
        </Text>


        {/* -----------------------------------------------
            DESCRIPTION
        ----------------------------------------------- */}

        <Text style={styles.descriptionTitle}>
          Description
        </Text>

        <Text style={styles.description}>
          {product.description}
        </Text>

      </View>


      
      <View style={styles.bottomContainer}>

  {/* VIRTUAL TRY-ON */}

  <TouchableOpacity
    onPress={handleTryOn}
    style={[
      styles.actionButton,
      styles.tryOnButton,
    ]}
    activeOpacity={0.8}
  >
    <Text style={styles.actionText}>
      👗 Try It On
    </Text>
  </TouchableOpacity>


  {/* ADD TO CART */}

  <TouchableOpacity
    onPress={handleAddToCart}
    style={[
      styles.actionButton,
      styles.cartButton,
    ]}
    activeOpacity={0.8}
  >
    <Text style={styles.actionText}>
      🛒 Add To Cart
    </Text>
  </TouchableOpacity>


        {/* BUY NOW */}

        <TouchableOpacity
          onPress={handleBuyNow}
          style={[
            styles.actionButton,
            styles.buyButton,
          ]}
          activeOpacity={0.8}
        >
          <Text style={styles.actionText}>
            ⚡ Buy Now
          </Text>
        </TouchableOpacity>

</View>


      {/* ==================================================
          BUY NOW + AI RECOMMENDATION MODAL
      ================================================== */}

      <Modal
        visible={showBuyNow}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setShowBuyNow(false)
        }
      >

        <View style={styles.modalOverlay}>

          <View style={styles.buyModal}>

            {/* -------------------------------------------
                HEADER
            ------------------------------------------- */}

            <View style={styles.modalHeader}>

              <Text style={styles.modalTitle}>
                Buy Now
              </Text>

              <TouchableOpacity
                onPress={() =>
                  setShowBuyNow(false)
                }
              >

                <Text style={styles.closeButton}>
                  ×
                </Text>

              </TouchableOpacity>

            </View>


            {/* -------------------------------------------
                PRODUCT
            ------------------------------------------- */}

            <View style={styles.modalProductRow}>

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
                style={styles.modalProductImage}
              />

              <View
                style={{
                  flex: 1,
                }}
              >

                <Text
                  style={styles.modalProductName}
                >
                  {product.name}
                </Text>

                <Text
                  style={styles.modalCurrentPrice}
                >
                  ₹{product.price}
                </Text>

              </View>

            </View>


            {/* =================================================
                AI PRICE INSIGHT
            ================================================= */}

            {hasPrediction ? (

              <View style={styles.aiCard}>

                <Text style={styles.aiTitle}>
                  🤖 AI Price Insight
                </Text>


                <View style={styles.aiDivider} />


                {/* CURRENT PRICE */}

                <View style={styles.aiRow}>

                  <Text style={styles.aiLabel}>
                    Current Price
                  </Text>

                  <Text style={styles.aiValue}>
                    ₹{Number(
                      product.price
                    ).toFixed(2)}
                  </Text>

                </View>


                {/* PREDICTED PRICE */}

                <View style={styles.aiRow}>

                  <Text style={styles.aiLabel}>
                    AI Predicted Price
                  </Text>

                  <Text style={styles.predictedPrice}>
                    ₹{predictedPrice.toFixed(2)}
                  </Text>

                </View>


                {/* CHANGE */}

                <View style={styles.aiRow}>

                  <Text style={styles.aiLabel}>
                    Expected Change
                  </Text>

                  <Text
                    style={[
                      styles.aiValue,
                      {
                        color:
                          changePercent > 0
                            ? "#16A34A"
                            : changePercent < 0
                            ? "#DC2626"
                            : "#6B7280",
                      },
                    ]}
                  >
                    {changePercent >= 0
                      ? "+"
                      : ""}
                    {changePercent.toFixed(2)}%
                  </Text>

                </View>


                {/* RECOMMENDATION */}

                <View
                  style={
                    styles.recommendationBox
                  }
                >

                  <Text
                    style={
                      styles.recommendationIcon
                    }
                  >
                    {getRecommendationIcon()}
                  </Text>

                  <View
                    style={{
                      flex: 1,
                    }}
                  >

                    <Text
                      style={
                        styles.recommendationLabel
                      }
                    >
                      AI Recommendation
                    </Text>

                    <Text
                      style={
                        styles.recommendationTitle
                      }
                    >
                      {getRecommendationTitle()}
                    </Text>

                  </View>

                </View>


                {/* ADVICE */}

                <Text style={styles.advice}>
                  {advice}
                </Text>

              </View>

            ) : (

              /*
               * No prediction yet.
               *
               * Don't invent one.
               */

              <View style={styles.noPredictionBox}>

                <Text
                  style={styles.noPredictionTitle}
                >
                  🤖 AI Price Prediction
                </Text>

                <Text
                  style={styles.noPredictionText}
                >
                  AI price prediction is not
                  available for this product yet.
                </Text>

                <Text
                  style={styles.noPredictionText}
                >
                  You can still continue with
                  your purchase at the current
                  price.
                </Text>

              </View>

            )}


            {/* =================================================
                PURCHASE BUTTONS
            ================================================= */}

            <View style={styles.modalButtons}>

              <TouchableOpacity
                onPress={() =>
                  setShowBuyNow(false)
                }
                style={styles.cancelButton}
              >

                <Text
                  style={styles.cancelText}
                >
                  Go Back
                </Text>

              </TouchableOpacity>


              <TouchableOpacity
                onPress={
                  handleProceedToBuy
                }
                disabled={buying}
                style={[
                  styles.proceedButton,
                  buying &&
                    styles.disabledButton,
                ]}
              >

                {buying ? (

                  <ActivityIndicator
                    color="white"
                  />

                ) : (

                  <Text
                    style={
                      styles.proceedText
                    }
                  >
                    Continue to Buy
                  </Text>

                )}

              </TouchableOpacity>

            </View>

          </View>

        </View>

      </Modal>


      {/* ==================================================
    VIRTUAL TRY-ON MODAL
================================================== */}

<Modal
  visible={showTryOn}
  transparent
  animationType="fade"
  onRequestClose={() => {
    if (!tryOnLoading) {
      setShowTryOn(false);
      setTryOnImage(null);
    }
  }}
>

  <View style={styles.tryOnOverlay}>

    <View style={styles.tryOnModal}>

      {/* HEADER */}

      <View style={styles.tryOnHeader}>

        <Text style={styles.tryOnTitle}>
          👗 Virtual Try-On
        </Text>

        {!tryOnLoading && (
          <TouchableOpacity
            onPress={() => {
              setShowTryOn(false);
              setTryOnImage(null);
            }}
          >
            <Text style={styles.closeButton}>
              ×
            </Text>
          </TouchableOpacity>
        )}

      </View>


      {/* LOADING */}

      {tryOnLoading && (

        <View style={styles.tryOnLoading}>

          <ActivityIndicator
            size="large"
            color="#7C3AED"
          />

          <Text style={styles.tryOnLoadingTitle}>
            Creating your look...
          </Text>

          <Text style={styles.tryOnLoadingText}>
            AI is virtually dressing you in this product.
          </Text>

          <Text style={styles.tryOnLoadingHint}>
            This may take a little while.
          </Text>

        </View>

      )}


      {/* RESULT */}

      {!tryOnLoading && tryOnImage && (

        <View style={styles.tryOnResult}>

          <Image
            source={{
              uri: tryOnImage,
            }}
            style={styles.tryOnImage}
            resizeMode="contain"
          />

          <Text style={styles.tryOnSuccess}>
            ✨ Virtual Try-On Complete
          </Text>

        </View>

      )}

    </View>

  </View>

</Modal>

    </View>
  );
}


/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F8F8FA",
  },


  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F8FA",
  },


  imageContainer: {
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
  },


  productImage: {
    width: 300,
    height: 300,
    borderRadius: 20,
  },


  detailsContainer: {
    flex: 1,
    padding: 20,
  },


  /* PRODUCT TITLE */

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },


  productName: {
    flex: 1,
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
  },


  heartButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },


  heartIcon: {
    fontSize: 36,
    color: "#6B7280",
  },


  heartActive: {
    color: "#EF4444",
  },


  /* RATING */

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },


  stars: {
    fontSize: 18,
  },


  reviewText: {
    marginLeft: 8,
    color: "#6B7280",
  },


  /* PRICE */

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },


  currentPrice: {
    fontSize: 32,
    color: "#2563EB",
    fontWeight: "bold",
  },


  oldPrice: {
    marginLeft: 10,
    textDecorationLine: "line-through",
    color: "#9CA3AF",
    fontSize: 18,
  },


  discount: {
    color: "#10B981",
    fontWeight: "bold",
    marginTop: 5,
  },


  stock: {
    color: "#16A34A",
    marginTop: 10,
    fontWeight: "600",
  },


  /* DESCRIPTION */

  descriptionTitle: {
    marginTop: 25,
    fontSize: 22,
    fontWeight: "bold",
  },


  description: {
    marginTop: 10,
    color: "#4B5563",
    lineHeight: 24,
  },


  /* BOTTOM BUTTONS */

  bottomContainer: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "white",
    gap: 10,
  },


  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },


  cartButton: {
    backgroundColor: "#2563EB",
  },


  buyButton: {
    backgroundColor: "#F59E0B",
  },


  actionText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },


  /* =======================================================
     BUY NOW MODAL
  ======================================================= */

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },


  buyModal: {
    backgroundColor: "#F8F8FA",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: "90%",
  },


  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },


  modalTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#111827",
  },


  closeButton: {
    fontSize: 34,
    color: "#6B7280",
    lineHeight: 34,
  },


  modalProductRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
  },


  modalProductImage: {
    width: 65,
    height: 65,
    borderRadius: 12,
    marginRight: 12,
  },


  modalProductName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },


  modalCurrentPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2563EB",
    marginTop: 5,
  },


  /* AI CARD */

  aiCard: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },


  aiTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },


  aiDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 12,
  },


  aiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
  },


  aiLabel: {
    color: "#6B7280",
    fontSize: 15,
  },


  aiValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },


  predictedPrice: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#7C3AED",
  },


  recommendationBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F3FF",
    borderRadius: 14,
    padding: 13,
    marginTop: 12,
  },


  recommendationIcon: {
    fontSize: 27,
    marginRight: 12,
  },


  recommendationLabel: {
    color: "#6B7280",
    fontSize: 13,
  },


  recommendationTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 2,
  },


  advice: {
    marginTop: 12,
    color: "#4B5563",
    lineHeight: 21,
  },


  /* NO PREDICTION */

  noPredictionBox: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
  },


  noPredictionTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#111827",
  },


  noPredictionText: {
    color: "#6B7280",
    lineHeight: 21,
    marginTop: 8,
  },


  /* MODAL BUTTONS */

  modalButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 5,
  },


  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "white",
  },


  cancelText: {
    color: "#374151",
    fontWeight: "bold",
    fontSize: 15,
  },


  proceedButton: {
    flex: 1.5,
    backgroundColor: "#2563EB",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },


  disabledButton: {
    opacity: 0.6,
  },


  proceedText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },

  tryOnButton: {
  backgroundColor: "#7C3AED",
  },

  tryOnOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  tryOnModal: {
    width: "100%",
    maxWidth: 430,
    backgroundColor: "white",
    borderRadius: 24,
    padding: 20,
    maxHeight: "90%",
  },

  tryOnHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  tryOnTitle: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#111827",
  },

  tryOnLoading: {
    minHeight: 300,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  tryOnLoadingTitle: {
    marginTop: 20,
    fontSize: 19,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
  },

  tryOnLoadingText: {
    marginTop: 8,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 21,
  },

  tryOnLoadingHint: {
    marginTop: 12,
    color: "#9CA3AF",
    fontSize: 13,
    textAlign: "center",
  },

  tryOnResult: {
    alignItems: "center",
  },

  tryOnImage: {
    width: "100%",
    height: 500,
    borderRadius: 16,
  },

  tryOnSuccess: {
    marginTop: 15,
    fontSize: 17,
    fontWeight: "bold",
    color: "#16A34A",
    textAlign: "center",
  },

});


























































































































































































































































































































































































































