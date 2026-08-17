import {
  router,
} from "expo-router";

import {
  useState,
} from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";

import {
  addAddress,
} from "../../services/address.service";


export default function AddAddress() {

  const [form, setForm] =
    useState({

      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      isDefault: false,

    });


  const [saving, setSaving] =
    useState(false);


  const updateField = (
    field,
    value
  ) => {

    setForm(
      (previous) => ({
        ...previous,
        [field]: value,
      })
    );
  };


  const handleSave =
    async () => {

      if (
        !form.fullName.trim() ||
        !form.phone.trim() ||
        !form.addressLine1.trim() ||
        !form.city.trim() ||
        !form.state.trim() ||
        !form.pincode.trim()
      ) {

        Alert.alert(
          "Missing Information",
          "Please fill all required fields."
        );

        return;
      }


      try {

        setSaving(true);


        await addAddress({
          ...form,

          fullName:
            form.fullName.trim(),

          phone:
            form.phone.trim(),

          addressLine1:
            form.addressLine1.trim(),

          addressLine2:
            form.addressLine2.trim(),

          city:
            form.city.trim(),

          state:
            form.state.trim(),

          pincode:
            form.pincode.trim(),
        });


        Alert.alert(
          "Address Added",
          "Your delivery address has been saved.",
          [
            {
              text: "OK",
              onPress: () =>
                router.back(),
            },
          ]
        );

      } catch (error) {

        console.log(
          "ADD ADDRESS ERROR:",
          error?.response?.data ||
          error.message
        );

        Alert.alert(
          "Error",
          error?.response?.data?.message ||
          "Unable to save address."
        );

      } finally {

        setSaving(false);
      }
    };


  return (

    <View
      style={styles.container}
    >

      {/* HEADER */}

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
          style={styles.title}
        >
          Add Address
        </Text>


        <View
          style={{
            width: 35,
          }}
        />

      </View>


      <ScrollView
        contentContainerStyle={
          styles.content
        }
      >

        <Text
          style={styles.label}
        >
          Full Name *
        </Text>

        <TextInput
          value={form.fullName}
          onChangeText={(value) =>
            updateField(
              "fullName",
              value
            )
          }
          placeholder="Enter full name"
          style={styles.input}
        />


        <Text
          style={styles.label}
        >
          Phone *
        </Text>

        <TextInput
          value={form.phone}
          onChangeText={(value) =>
            updateField(
              "phone",
              value
            )
          }
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          style={styles.input}
        />


        <Text
          style={styles.label}
        >
          Address Line 1 *
        </Text>

        <TextInput
          value={
            form.addressLine1
          }
          onChangeText={(value) =>
            updateField(
              "addressLine1",
              value
            )
          }
          placeholder="House no, street"
          style={styles.input}
        />


        <Text
          style={styles.label}
        >
          Address Line 2
        </Text>

        <TextInput
          value={
            form.addressLine2
          }
          onChangeText={(value) =>
            updateField(
              "addressLine2",
              value
            )
          }
          placeholder="Apartment, landmark, etc."
          style={styles.input}
        />


        <Text
          style={styles.label}
        >
          City *
        </Text>

        <TextInput
          value={form.city}
          onChangeText={(value) =>
            updateField(
              "city",
              value
            )
          }
          placeholder="City"
          style={styles.input}
        />


        <Text
          style={styles.label}
        >
          State *
        </Text>

        <TextInput
          value={form.state}
          onChangeText={(value) =>
            updateField(
              "state",
              value
            )
          }
          placeholder="State"
          style={styles.input}
        />


        <Text
          style={styles.label}
        >
          Pincode *
        </Text>

        <TextInput
          value={form.pincode}
          onChangeText={(value) =>
            updateField(
              "pincode",
              value
            )
          }
          placeholder="Pincode"
          keyboardType="number-pad"
          maxLength={6}
          style={styles.input}
        />


        <Text
          style={styles.label}
        >
          Country
        </Text>

        <TextInput
          value={form.country}
          onChangeText={(value) =>
            updateField(
              "country",
              value
            )
          }
          style={styles.input}
        />


        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          style={[
            styles.saveButton,
            saving &&
              styles.disabled,
          ]}
        >

          <Text
            style={styles.saveText}
          >
            {saving
              ? "Saving..."
              : "Save Address"}
          </Text>

        </TouchableOpacity>

      </ScrollView>

    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F8F8FA",
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


  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
  },


  content: {
    padding: 20,
    paddingBottom: 40,
  },


  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 7,
    marginTop: 12,
  },


  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 13,
    fontSize: 16,
  },


  saveButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 25,
  },


  disabled: {
    opacity: 0.6,
  },


  saveText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },

});