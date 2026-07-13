import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Switch, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const COLORS = {
  primary: '#2563EB',
  secondary: '#60A5FA',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  pink: '#EC4899',
  background: '#F4F8FC',
  card: '#FFFFFF',
  textDark: '#0F172A',
  textMuted: '#64748B',
  border: '#E2E8F0',
};

function SectionCard({ title, icon, color, children }) {
  return (
    <View
      style={{
        backgroundColor: COLORS.card,
        borderRadius: 24,
        padding: 18,
        marginBottom: 18,
        shadowColor: '#1E293B',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.07,
        shadowRadius: 16,
        elevation: 3,
        borderWidth: 1,
        borderColor: COLORS.border,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 13,
            backgroundColor: `${color}18`,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}
        >
          <Ionicons name={icon} size={19} color={color} />
        </View>
        <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.textDark }}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function FieldRow({ label, value, onChangeText, keyboardType }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6, fontWeight: '600' }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType || 'default'}
        style={{
          backgroundColor: '#F8FAFF',
          borderRadius: 14,
          paddingHorizontal: 14,
          paddingVertical: 12,
          fontSize: 14,
          color: COLORS.textDark,
          borderWidth: 1,
          borderColor: COLORS.border,
        }}
      />
    </View>
  );
}

function ToggleRow({ icon, label, color, value, onValueChange, last }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: '#F1F5F9',
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 11,
          backgroundColor: `${color}18`,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}
      >
        <Ionicons name={icon} size={17} color={color} />
      </View>
      <Text style={{ flex: 1, fontSize: 14, fontWeight: '700', color: COLORS.textDark }}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E2E8F0', true: COLORS.secondary }}
        thumbColor={value ? COLORS.primary : '#f4f3f4'}
      />
    </View>
  );
}

function LinkRow({ icon, label, color, last }) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: '#F1F5F9',
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 11,
          backgroundColor: `${color}18`,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}
      >
        <Ionicons name={icon} size={17} color={color} />
      </View>
      <Text style={{ flex: 1, fontSize: 14, fontWeight: '700', color: COLORS.textDark }}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
    </TouchableOpacity>
  );
}

export default function PlatformSettings() {
  const router = useRouter();

  const [appName, setAppName] = useState('Aureva');
  const [supportEmail, setSupportEmail] = useState('support@aureva.com');
  const [supportPhone, setSupportPhone] = useState('+91 1800 202 4040');
  const [supportAddress, setSupportAddress] = useState('4th Floor, Prestige Tech Park, Bengaluru');
  const [businessHours, setBusinessHours] = useState('9:00 AM - 7:00 PM, Mon-Sat');

  const [commission, setCommission] = useState('12');
  const [gst, setGst] = useState('18');
  const [platformFee, setPlatformFee] = useState('2.5');

  const [shippingCharge, setShippingCharge] = useState('49');
  const [freeShippingLimit, setFreeShippingLimit] = useState('499');
  const [maxDeliveryDistance, setMaxDeliveryDistance] = useState('120');

  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [complaintAlerts, setComplaintAlerts] = useState(true);

  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  const handleSave = () => {
    Alert.alert('Settings Saved', 'Your platform settings have been updated successfully.');
  };

  const handleReset = () => {
    Alert.alert('Reset Settings', 'This will revert all settings to their default values.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive' },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* App Bar */}
      <View
        style={{
          paddingTop: 56,
          paddingHorizontal: 20,
          paddingBottom: 18,
          backgroundColor: COLORS.card,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
          shadowColor: '#1E293B',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 3,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              backgroundColor: '#EFF6FF',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: '800', color: COLORS.textDark }}>Platform Settings</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              backgroundColor: '#EFF6FF',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="notifications-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 6 }}>Manage application settings.</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 130 }}>
        {/* General Settings */}
        <SectionCard title="General Settings" icon="settings-outline" color={COLORS.primary}>
          <FieldRow label="Application Name" value={appName} onChangeText={setAppName} />
          <FieldRow label="Support Email" value={supportEmail} onChangeText={setSupportEmail} keyboardType="email-address" />
          <FieldRow label="Support Phone" value={supportPhone} onChangeText={setSupportPhone} keyboardType="phone-pad" />
          <FieldRow label="Support Address" value={supportAddress} onChangeText={setSupportAddress} />
          <FieldRow label="Business Hours" value={businessHours} onChangeText={setBusinessHours} />
        </SectionCard>

        {/* Commission Settings */}
        <SectionCard title="Commission Settings" icon="cash-outline" color={COLORS.success}>
          <FieldRow label="Commission Percentage (%)" value={commission} onChangeText={setCommission} keyboardType="numeric" />
          <FieldRow label="GST Percentage (%)" value={gst} onChangeText={setGst} keyboardType="numeric" />
          <FieldRow label="Platform Fee (%)" value={platformFee} onChangeText={setPlatformFee} keyboardType="numeric" />
        </SectionCard>

        {/* Shipping Settings */}
        <SectionCard title="Shipping Settings" icon="car-outline" color={COLORS.purple}>
          <FieldRow label="Default Shipping Charge (₹)" value={shippingCharge} onChangeText={setShippingCharge} keyboardType="numeric" />
          <FieldRow label="Free Shipping Limit (₹)" value={freeShippingLimit} onChangeText={setFreeShippingLimit} keyboardType="numeric" />
          <FieldRow label="Maximum Delivery Distance (km)" value={maxDeliveryDistance} onChangeText={setMaxDeliveryDistance} keyboardType="numeric" />
        </SectionCard>

        {/* Notifications */}
        <SectionCard title="Notifications" icon="notifications-outline" color={COLORS.warning}>
          <ToggleRow icon="mail-outline" label="Email Notifications" color={COLORS.primary} value={emailNotif} onValueChange={setEmailNotif} />
          <ToggleRow icon="phone-portrait-outline" label="Push Notifications" color={COLORS.purple} value={pushNotif} onValueChange={setPushNotif} />
          <ToggleRow icon="chatbox-outline" label="SMS Notifications" color={COLORS.pink} value={smsNotif} onValueChange={setSmsNotif} />
          <ToggleRow icon="warning-outline" label="Complaint Alerts" color={COLORS.danger} value={complaintAlerts} onValueChange={setComplaintAlerts} last />
        </SectionCard>

        {/* Maintenance */}
        <SectionCard title="Maintenance" icon="construct-outline" color={COLORS.secondary}>
          <ToggleRow icon="build-outline" label="Maintenance Mode" color={COLORS.warning} value={maintenanceMode} onValueChange={setMaintenanceMode} />
          <ToggleRow icon="bug-outline" label="Debug Mode" color={COLORS.danger} value={debugMode} onValueChange={setDebugMode} />
          <LinkRow icon="server-outline" label="Cache Settings" color={COLORS.primary} last />
        </SectionCard>

        {/* Legal */}
        <SectionCard title="Legal" icon="document-text-outline" color={COLORS.pink}>
          <LinkRow icon="shield-outline" label="Privacy Policy" color={COLORS.primary} />
          <LinkRow icon="reader-outline" label="Terms & Conditions" color={COLORS.purple} />
          <LinkRow icon="cash-outline" label="Refund Policy" color={COLORS.success} />
          <LinkRow icon="information-circle-outline" label="About Platform" color={COLORS.secondary} last />
        </SectionCard>

        {/* Action Buttons */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSave}
          style={{
            backgroundColor: COLORS.primary,
            paddingVertical: 16,
            borderRadius: 18,
            alignItems: 'center',
            marginTop: 6,
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 14,
            elevation: 4,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleReset}
          style={{
            borderWidth: 1.5,
            borderColor: COLORS.danger,
            paddingVertical: 16,
            borderRadius: 18,
            alignItems: 'center',
            marginTop: 12,
          }}
        >
          <Text style={{ color: COLORS.danger, fontWeight: '800', fontSize: 15 }}>Reset Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}