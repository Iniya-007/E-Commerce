import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Switch,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// ---------------------------------------------------------------------------
// Theme
// ---------------------------------------------------------------------------
const COLORS = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primarySoft: '#EAF1FF',
  success: '#22C55E',
  successSoft: '#E9FBF0',
  warning: '#F59E0B',
  warningSoft: '#FEF6E4',
  danger: '#EF4444',
  dangerSoft: '#FDEBEB',
  bg: '#F5F7FB',
  card: '#FFFFFF',
  border: '#E7EAF2',
  text: '#0F172A',
  textMuted: '#64748B',
  textFaint: '#9AA6B8',
};

// ---------------------------------------------------------------------------
// UI-only placeholder data
// ---------------------------------------------------------------------------
// TODO: Connect to backend API — replace with GET /api/seller/settings
const DEFAULT_SETTINGS = {
  storeName: 'Kanchi Weaves Co.',
  storeLogo: null,
  storeBanner: null,
  gst: '33ABCDE1234F1Z5',
  pan: 'ABCDE1234F',
  address: '14 Textile Market Road, T. Nagar, Chennai, TN 600017',
  bankAccountName: 'Kanchi Weaves Co.',
  bankAccountNumber: '50100234567890',
  bankIfsc: 'HDFC0001234',
  bankName: 'HDFC Bank',
  notifications: {
    orderUpdates: true,
    paymentAlerts: true,
    promotions: false,
    lowStock: true,
  },
  shipping: {
    freeShippingThreshold: '999',
    processingTime: '2',
    localDelivery: true,
    codAvailable: true,
  },
};

export default function SellerSettings() {
  const router = useRouter();

  const [storeName, setStoreName] = useState(DEFAULT_SETTINGS.storeName);
  const [gst, setGst] = useState(DEFAULT_SETTINGS.gst);
  const [pan, setPan] = useState(DEFAULT_SETTINGS.pan);
  const [address, setAddress] = useState(DEFAULT_SETTINGS.address);
  const [bankAccountName, setBankAccountName] = useState(DEFAULT_SETTINGS.bankAccountName);
  const [bankAccountNumber, setBankAccountNumber] = useState(DEFAULT_SETTINGS.bankAccountNumber);
  const [bankIfsc, setBankIfsc] = useState(DEFAULT_SETTINGS.bankIfsc);
  const [bankName, setBankName] = useState(DEFAULT_SETTINGS.bankName);
  const [notifications, setNotifications] = useState(DEFAULT_SETTINGS.notifications);
  const [shipping, setShipping] = useState(DEFAULT_SETTINGS.shipping);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [expanded, setExpanded] = useState({
    storeInfo: true,
    business: false,
    bank: false,
    notifications: false,
    shipping: false,
    password: false,
  });

  const toggleSection = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleNotification = (key) =>
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleShippingFlag = (key) =>
    setShipping((prev) => ({ ...prev, [key]: !prev[key] }));

  // -------------------------------------------------------------------------
  // Placeholder action handlers
  // -------------------------------------------------------------------------
  const handleChangeLogo = () => {
    // TODO: Connect to backend API — open image picker and upload store logo
    console.log('Change Store Logo');
  };

  const handleChangeBanner = () => {
    // TODO: Connect to backend API — open image picker and upload store banner
    console.log('Change Store Banner');
  };

  const handleSave = () => {
    // TODO: Connect to backend API — PUT /api/seller/settings with the
    // combined store, business, bank, notification, and shipping fields.
    console.log('Save Settings', {
      storeName,
      gst,
      pan,
      address,
      bankAccountName,
      bankAccountNumber,
      bankIfsc,
      bankName,
      notifications,
      shipping,
    });
    Alert.alert('Settings saved', 'Your store settings have been updated.');
  };

  const handleReset = () => {
    Alert.alert('Reset changes?', 'This will discard any unsaved changes.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => {
          setStoreName(DEFAULT_SETTINGS.storeName);
          setGst(DEFAULT_SETTINGS.gst);
          setPan(DEFAULT_SETTINGS.pan);
          setAddress(DEFAULT_SETTINGS.address);
          setBankAccountName(DEFAULT_SETTINGS.bankAccountName);
          setBankAccountNumber(DEFAULT_SETTINGS.bankAccountNumber);
          setBankIfsc(DEFAULT_SETTINGS.bankIfsc);
          setBankName(DEFAULT_SETTINGS.bankName);
          setNotifications(DEFAULT_SETTINGS.notifications);
          setShipping(DEFAULT_SETTINGS.shipping);
        },
      },
    ]);
  };

  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Missing details', 'Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Passwords don't match", 'New password and confirmation must match.');
      return;
    }
    // TODO: Connect to backend API — POST /api/seller/change-password
    console.log('Update Password');
    Alert.alert('Password updated', 'Your password has been changed.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleLogout = () => {
    Alert.alert('Log out?', 'You will need to sign in again to access your seller account.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => {
          // TODO: Connect to backend API — clear session/auth token, then
          // navigate to the login screen, e.g. router.replace('/login')
          console.log('Logout');
          router.replace?.('/login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 4,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: COLORS.card,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <Ionicons name="chevron-back" size={20} color={COLORS.text} />
        </TouchableOpacity>

        <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.text }}>Store Settings</Text>

        <View style={{ width: 38, height: 38 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 150, paddingTop: 6 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Store Information */}
          <Accordion
            title="Store Information"
            icon="storefront-outline"
            expanded={expanded.storeInfo}
            onToggle={() => toggleSection('storeInfo')}
          >
            <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.textMuted, marginBottom: 8 }}>
              Store Banner
            </Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleChangeBanner}
              style={{
                height: 100,
                borderRadius: 16,
                backgroundColor: COLORS.primarySoft,
                borderWidth: 1.5,
                borderStyle: 'dashed',
                borderColor: COLORS.border,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <Ionicons name="image-outline" size={22} color={COLORS.primary} />
              <Text style={{ fontSize: 11.5, fontWeight: '700', color: COLORS.primary, marginTop: 6 }}>
                Change Banner
              </Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <View
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 20,
                  backgroundColor: COLORS.primarySoft,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="business-outline" size={26} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.textMuted, marginBottom: 8 }}>
                  Store Logo
                </Text>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleChangeLogo}
                  style={{
                    alignSelf: 'flex-start',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    borderWidth: 1.5,
                    borderColor: COLORS.border,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                  }}
                >
                  <Ionicons name="camera-outline" size={14} color={COLORS.text} />
                  <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.text }}>Change Logo</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Field label="Store Name">
              <TextInput
                value={storeName}
                onChangeText={setStoreName}
                placeholder="Your store name"
                placeholderTextColor={COLORS.textFaint}
                style={inputText}
              />
            </Field>
          </Accordion>

          {/* Business Details */}
          <Accordion
            title="Business Details"
            icon="document-text-outline"
            expanded={expanded.business}
            onToggle={() => toggleSection('business')}
          >
            <Field label="GST Number">
              <TextInput
                value={gst}
                onChangeText={setGst}
                placeholder="GSTIN"
                placeholderTextColor={COLORS.textFaint}
                autoCapitalize="characters"
                style={inputText}
              />
            </Field>

            <View style={{ height: 12 }} />
            <Field label="PAN Number">
              <TextInput
                value={pan}
                onChangeText={setPan}
                placeholder="PAN"
                placeholderTextColor={COLORS.textFaint}
                autoCapitalize="characters"
                style={inputText}
              />
            </Field>

            <View style={{ height: 12 }} />
            <Field label="Business Address" alignTop>
              <TextInput
                value={address}
                onChangeText={setAddress}
                placeholder="Registered business address"
                placeholderTextColor={COLORS.textFaint}
                multiline
                numberOfLines={3}
                style={[inputText, { minHeight: 66, textAlignVertical: 'top' }]}
              />
            </Field>
          </Accordion>

          {/* Bank Details */}
          <Accordion
            title="Bank Details"
            icon="card-outline"
            expanded={expanded.bank}
            onToggle={() => toggleSection('bank')}
          >
            <Field label="Account Holder Name">
              <TextInput
                value={bankAccountName}
                onChangeText={setBankAccountName}
                placeholder="Name on the account"
                placeholderTextColor={COLORS.textFaint}
                style={inputText}
              />
            </Field>

            <View style={{ height: 12 }} />
            <Field label="Account Number">
              <TextInput
                value={bankAccountNumber}
                onChangeText={setBankAccountNumber}
                placeholder="Bank account number"
                placeholderTextColor={COLORS.textFaint}
                keyboardType="number-pad"
                style={inputText}
              />
            </Field>

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
              <View style={{ flex: 1 }}>
                <Field label="IFSC Code">
                  <TextInput
                    value={bankIfsc}
                    onChangeText={setBankIfsc}
                    placeholder="IFSC"
                    placeholderTextColor={COLORS.textFaint}
                    autoCapitalize="characters"
                    style={inputText}
                  />
                </Field>
              </View>
              <View style={{ flex: 1 }}>
                <Field label="Bank Name">
                  <TextInput
                    value={bankName}
                    onChangeText={setBankName}
                    placeholder="Bank name"
                    placeholderTextColor={COLORS.textFaint}
                    style={inputText}
                  />
                </Field>
              </View>
            </View>
          </Accordion>

          {/* Notification Settings */}
          <Accordion
            title="Notification Settings"
            icon="notifications-outline"
            expanded={expanded.notifications}
            onToggle={() => toggleSection('notifications')}
          >
            <ToggleRow
              label="Order Updates"
              description="Get notified for new and updated orders"
              value={notifications.orderUpdates}
              onToggle={() => toggleNotification('orderUpdates')}
            />
            <ToggleRow
              label="Payment Alerts"
              description="Alerts for payments and payouts"
              value={notifications.paymentAlerts}
              onToggle={() => toggleNotification('paymentAlerts')}
            />
            <ToggleRow
              label="Low Stock Warnings"
              description="Get notified when stock runs low"
              value={notifications.lowStock}
              onToggle={() => toggleNotification('lowStock')}
            />
            <ToggleRow
              label="Promotions & Tips"
              description="Occasional tips to grow your store"
              value={notifications.promotions}
              onToggle={() => toggleNotification('promotions')}
              isLast
            />
          </Accordion>

          {/* Shipping Settings */}
          <Accordion
            title="Shipping Settings"
            icon="cube-outline"
            expanded={expanded.shipping}
            onToggle={() => toggleSection('shipping')}
          >
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Field label="Free Shipping Above (₹)">
                  <TextInput
                    value={shipping.freeShippingThreshold}
                    onChangeText={(t) => setShipping((prev) => ({ ...prev, freeShippingThreshold: t }))}
                    placeholder="0"
                    placeholderTextColor={COLORS.textFaint}
                    keyboardType="number-pad"
                    style={inputText}
                  />
                </Field>
              </View>
              <View style={{ flex: 1 }}>
                <Field label="Processing Time (days)">
                  <TextInput
                    value={shipping.processingTime}
                    onChangeText={(t) => setShipping((prev) => ({ ...prev, processingTime: t }))}
                    placeholder="0"
                    placeholderTextColor={COLORS.textFaint}
                    keyboardType="number-pad"
                    style={inputText}
                  />
                </Field>
              </View>
            </View>

            <View style={{ marginTop: 6 }}>
              <ToggleRow
                label="Local Delivery"
                description="Offer delivery within your local area"
                value={shipping.localDelivery}
                onToggle={() => toggleShippingFlag('localDelivery')}
              />
              <ToggleRow
                label="Cash on Delivery"
                description="Allow customers to pay on delivery"
                value={shipping.codAvailable}
                onToggle={() => toggleShippingFlag('codAvailable')}
                isLast
              />
            </View>
          </Accordion>

          {/* Change Password */}
          <Accordion
            title="Change Password"
            icon="lock-closed-outline"
            expanded={expanded.password}
            onToggle={() => toggleSection('password')}
          >
            <Field label="Current Password">
              <TextInput
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                placeholderTextColor={COLORS.textFaint}
                secureTextEntry
                style={inputText}
              />
            </Field>

            <View style={{ height: 12 }} />
            <Field label="New Password">
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                placeholderTextColor={COLORS.textFaint}
                secureTextEntry
                style={inputText}
              />
            </Field>

            <View style={{ height: 12 }} />
            <Field label="Confirm New Password">
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Re-enter new password"
                placeholderTextColor={COLORS.textFaint}
                secureTextEntry
                style={inputText}
              />
            </Field>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleUpdatePassword}
              style={{
                marginTop: 16,
                backgroundColor: COLORS.primary,
                borderRadius: 13,
                paddingVertical: 12,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#FFFFFF' }}>Update Password</Text>
            </TouchableOpacity>
          </Accordion>

          {/* Logout */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleLogout}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              backgroundColor: COLORS.dangerSoft,
              borderRadius: 16,
              paddingVertical: 14,
              marginTop: 20,
            }}
          >
            <Ionicons name="log-out-outline" size={17} color={COLORS.danger} />
            <Text style={{ fontSize: 13.5, fontWeight: '700', color: COLORS.danger }}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sticky Save / Reset bar */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: COLORS.card,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 22,
          flexDirection: 'row',
          gap: 10,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleReset}
          style={{
            flex: 1,
            borderWidth: 1.5,
            borderColor: COLORS.border,
            borderRadius: 16,
            paddingVertical: 14,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 13.5, fontWeight: '700', color: COLORS.text }}>Reset</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSave}
          style={{
            flex: 2,
            backgroundColor: COLORS.primary,
            borderRadius: 16,
            paddingVertical: 14,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 8,
          }}
        >
          <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>Save Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Building blocks
// ---------------------------------------------------------------------------
const inputText = { flex: 1, fontSize: 14.5, color: COLORS.text, paddingVertical: 0 };

function Accordion({ title, icon, expanded, onToggle, children }) {
  return (
    <View
      style={{
        backgroundColor: COLORS.card,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginTop: 14,
        overflow: 'hidden',
      }}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onToggle}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 18,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              backgroundColor: COLORS.primarySoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name={icon} size={16} color={COLORS.primary} />
          </View>
          <Text style={{ fontSize: 14, fontWeight: '800', color: COLORS.text }}>{title}</Text>
        </View>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={COLORS.textMuted} />
      </TouchableOpacity>

      {expanded && (
        <View style={{ paddingHorizontal: 18, paddingBottom: 18 }}>
          <View style={{ height: 1, backgroundColor: COLORS.border, marginBottom: 16 }} />
          {children}
        </View>
      )}
    </View>
  );
}

function Field({ label, children, alignTop }) {
  return (
    <View>
      <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.textMuted, marginBottom: 8 }}>
        {label}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: alignTop ? 'flex-start' : 'center',
          backgroundColor: COLORS.bg,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: COLORS.border,
          paddingHorizontal: 14,
          paddingVertical: 13,
        }}
      >
        {children}
      </View>
    </View>
  );
}

function ToggleRow({ label, description, value, onToggle, isLast }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: COLORS.border,
      }}
    >
      <View style={{ flex: 1, marginRight: 12 }}>
        <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.text }}>{label}</Text>
        {description ? (
          <Text style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>{description}</Text>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: COLORS.border, true: COLORS.primary }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}