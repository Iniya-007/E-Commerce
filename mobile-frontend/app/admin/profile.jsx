import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Switch, StatusBar, Alert } from 'react-native';
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

const ADMIN = {
  name: 'Ayesha Fatima',
  role: 'Platform Administrator',
  avatar: 'https://i.pravatar.cc/300?img=47',
  email: 'ayesha.fatima@aureva.com',
  phone: '+91 98450 12345',
  employeeId: 'AUR-ADM-0042',
  department: 'Trust & Safety',
  joined: '14 Feb 2024',
};

function SectionCard({ children, style }) {
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
        ...style,
      }}
    >
      {children}
    </View>
  );
}

function InfoRow({ icon, label, value, color }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
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
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 11, color: COLORS.textMuted }}>{label}</Text>
        <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.textDark, marginTop: 1 }}>{value}</Text>
      </View>
    </View>
  );
}

function ActionRow({ icon, label, color, onPress, danger }) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 13,
        borderBottomWidth: 1,
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
      <Text
        style={{
          flex: 1,
          fontSize: 14,
          fontWeight: '700',
          color: danger ? COLORS.danger : COLORS.textDark,
        }}
      >
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
    </TouchableOpacity>
  );
}

function ToggleRow({ icon, label, color, value, onValueChange }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 13,
        borderBottomWidth: 1,
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

export default function Profile() {
  const router = useRouter();
  const [biometrics, setBiometrics] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);

  const confirmLogout = () =>
    Alert.alert('Log Out', 'Are you sure you want to log out of Aureva Admin?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive' },
    ]);

  const confirmDeactivate = () =>
    Alert.alert('Deactivate Account', 'This will disable your admin access until reactivated.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Deactivate', style: 'destructive' },
    ]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Gradient-like header using stacked color blocks */}
      <View style={{ backgroundColor: COLORS.primary, paddingTop: 56, paddingBottom: 46, borderBottomLeftRadius: 36, borderBottomRightRadius: 36, overflow: 'hidden' }}>
        <View
          style={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 160,
            height: 160,
            borderRadius: 80,
            backgroundColor: COLORS.secondary,
            opacity: 0.35,
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: -50,
            left: -30,
            width: 140,
            height: 140,
            borderRadius: 70,
            backgroundColor: COLORS.purple,
            opacity: 0.3,
          }}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              backgroundColor: 'rgba(255,255,255,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: '800', color: '#fff' }}>Admin Profile</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              backgroundColor: 'rgba(255,255,255,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="notifications-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: 'center', marginTop: 22 }}>
          <View
            style={{
              width: 108,
              height: 108,
              borderRadius: 54,
              padding: 4,
              backgroundColor: 'rgba(255,255,255,0.25)',
            }}
          >
            <Image source={{ uri: ADMIN.avatar }} style={{ width: '100%', height: '100%', borderRadius: 50 }} />
            <View
              style={{
                position: 'absolute',
                bottom: 2,
                right: 2,
                backgroundColor: COLORS.success,
                width: 26,
                height: 26,
                borderRadius: 13,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 3,
                borderColor: COLORS.primary,
              }}
            >
              <Ionicons name="checkmark" size={13} color="#fff" />
            </View>
          </View>
          <Text style={{ fontSize: 21, fontWeight: '800', color: '#fff', marginTop: 12 }}>{ADMIN.name}</Text>
          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.2)',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 12,
                marginRight: 8,
              }}
            >
              <Ionicons name="shield-checkmark-outline" size={13} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700', marginLeft: 5 }}>{ADMIN.role}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'rgba(34,197,94,0.35)',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 12,
              }}
            >
              <Ionicons name="checkmark-circle" size={13} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700', marginLeft: 5 }}>Verified</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 100, marginTop: -22 }}>
        {/* Personal Information */}
        <SectionCard>
          <Text style={{ fontSize: 15, fontWeight: '800', color: COLORS.textDark, marginBottom: 6 }}>
            Personal Information
          </Text>
          <InfoRow icon="person-outline" label="Full Name" value={ADMIN.name} color={COLORS.primary} />
          <InfoRow icon="mail-outline" label="Email" value={ADMIN.email} color={COLORS.purple} />
          <InfoRow icon="call-outline" label="Phone" value={ADMIN.phone} color={COLORS.success} />
          <InfoRow icon="id-card-outline" label="Employee ID" value={ADMIN.employeeId} color={COLORS.warning} />
          <InfoRow icon="business-outline" label="Department" value={ADMIN.department} color={COLORS.pink} />
          <InfoRow icon="calendar-outline" label="Joined Date" value={ADMIN.joined} color={COLORS.secondary} />
        </SectionCard>

        {/* Quick Actions */}
        <SectionCard>
          <Text style={{ fontSize: 15, fontWeight: '800', color: COLORS.textDark, marginBottom: 6 }}>
            Quick Actions
          </Text>
          <ActionRow icon="create-outline" label="Edit Profile" color={COLORS.primary} onPress={() => {}} />
          <ActionRow icon="key-outline" label="Change Password" color={COLORS.purple} onPress={() => {}} />
          <ActionRow icon="notifications-outline" label="Notification Settings" color={COLORS.warning} onPress={() => {}} />
          <ActionRow icon="lock-closed-outline" label="Privacy Settings" color={COLORS.pink} onPress={() => {}} />
        </SectionCard>

        {/* Security */}
        <SectionCard>
          <Text style={{ fontSize: 15, fontWeight: '800', color: COLORS.textDark, marginBottom: 6 }}>Security</Text>
          <ToggleRow
            icon="finger-print-outline"
            label="Enable Biometrics"
            color={COLORS.success}
            value={biometrics}
            onValueChange={setBiometrics}
          />
          <ToggleRow
            icon="shield-checkmark-outline"
            label="Two-Factor Authentication"
            color={COLORS.primary}
            value={twoFactor}
            onValueChange={setTwoFactor}
          />
          <ActionRow icon="time-outline" label="Login History" color={COLORS.secondary} onPress={() => {}} />
          <ActionRow icon="phone-portrait-outline" label="Devices" color={COLORS.purple} onPress={() => {}} />
        </SectionCard>

        {/* Danger Zone */}
        <SectionCard style={{ borderColor: '#FCD5D5' }}>
          <Text style={{ fontSize: 15, fontWeight: '800', color: COLORS.danger, marginBottom: 6 }}>Danger Zone</Text>
          <ActionRow icon="log-out-outline" label="Logout" color={COLORS.danger} onPress={confirmLogout} danger />
          <ActionRow
            icon="trash-outline"
            label="Deactivate Account"
            color={COLORS.danger}
            onPress={confirmDeactivate}
            danger
          />
        </SectionCard>
      </ScrollView>
    </View>
  );
}