import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const API_URL = 'http://your-backend-url:3000/api';

export default function PaymentScreen({ route, navigation }) {
  const { rideId, amount, driverName } = route.params;
  const [selectedPayment, setSelectedPayment] = useState('stripe');
  const [loading, setLoading] = useState(false);

  const handleStripePayment = async () => {
    setLoading(true);
    try {
      const intentResponse = await axios.post(`${API_URL}/payments/stripe/intent`, {
        amount, currency: 'usd', rideId
      });

      const confirmResponse = await axios.post(`${API_URL}/payments/stripe/confirm`, {
        paymentIntentId: intentResponse.data.paymentIntentId, rideId, amount
      });

      Alert.alert('✅ Éxito', 'Pago completado');
      navigation.goBack();
    } catch (error) {
      Alert.alert('❌ Error', error.response?.data?.error || 'Error en el pago');
    } finally {
      setLoading(false);
    }
  };

  const handleMercadoPagoPayment = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/payments/mercadopago/preference`, {
        amount, rideId, driverName
      });
      Alert.alert('✅ Éxito', 'Redirigiendo a Mercado Pago');
      navigation.goBack();
    } catch (error) {
      Alert.alert('❌ Error', error.response?.data?.error || 'Error en el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pagar Viaje</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Conductor:</Text>
          <Text style={styles.summaryValue}>{driverName}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Monto:</Text>
          <Text style={styles.summaryValueAmount}>${amount.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Método de Pago</Text>

        <TouchableOpacity
          style={[styles.paymentOption, selectedPayment === 'stripe' && styles.paymentOptionActive]}
          onPress={() => setSelectedPayment('stripe')}
        >
          <View style={styles.paymentOptionLeft}>
            <View style={[styles.radio, selectedPayment === 'stripe' && styles.radioActive]}>
              {selectedPayment === 'stripe' && <View style={styles.radioDot} />}
            </View>
            <View>
              <Text style={styles.paymentOptionTitle}>💳 Tarjeta de Crédito</Text>
              <Text style={styles.paymentOptionSubtitle}>Visa, Mastercard, Amex</Text>
            </View>
          </View>
          <Ionicons name="card" size={24} color="#5469d4" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.paymentOption, selectedPayment === 'mercadopago' && styles.paymentOptionActive]}
          onPress={() => setSelectedPayment('mercadopago')}
        >
          <View style={styles.paymentOptionLeft}>
            <View style={[styles.radio, selectedPayment === 'mercadopago' && styles.radioActive]}>
              {selectedPayment === 'mercadopago' && <View style={styles.radioDot} />}
            </View>
            <View>
              <Text style={styles.paymentOptionTitle}>💰 Mercado Pago</Text>
              <Text style={styles.paymentOptionSubtitle}>Billetera Virtual</Text>
            </View>
          </View>
          <Ionicons name="wallet" size={24} color="#009ee3" />
        </TouchableOpacity>
      </View>

      <View style={styles.securityInfo}>
        <Ionicons name="shield-checkmark" size={20} color="#4caf50" />
        <Text style={styles.securityText}>Tus datos están protegidos y encriptados</Text>
      </View>

      <TouchableOpacity
        style={[styles.payButton, loading && styles.payButtonDisabled]}
        onPress={selectedPayment === 'stripe' ? handleStripePayment : handleMercadoPagoPayment}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <Ionicons name="lock-closed" size={18} color="#fff" />
            <Text style={styles.payButtonText}>Pagar ${amount.toFixed(2)}</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  summary: { backgroundColor: '#f5f5f5', padding: 20, marginVertical: 16, marginHorizontal: 16, borderRadius: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 14, color: '#666' },
  summaryValue: { fontSize: 14, fontWeight: '600', color: '#000' },
  summaryValueAmount: { fontSize: 18, fontWeight: '700', color: '#000' },
  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  paymentOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderWidth: 1, borderColor: '#ddd', borderRadius: 12, marginBottom: 12, backgroundColor: '#fff' },
  paymentOptionActive: { borderColor: '#000', backgroundColor: '#f9f9f9' },
  paymentOptionLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#ddd', justifyContent: 'center', alignItems: 'center' },
  radioActive: { borderColor: '#000' },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#000' },
  paymentOptionTitle: { fontSize: 14, fontWeight: '600', color: '#000' },
  paymentOptionSubtitle: { fontSize: 12, color: '#999', marginTop: 4 },
  securityInfo: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  securityText: { flex: 1, fontSize: 12, color: '#4caf50' },
  payButton: { flexDirection: 'row', backgroundColor: '#000', paddingVertical: 14, paddingHorizontal: 16, marginHorizontal: 16, marginBottom: 20, borderRadius: 8, alignItems: 'center', justifyContent: 'center', gap: 8 },
  payButtonDisabled: { opacity: 0.6 },
  payButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});
