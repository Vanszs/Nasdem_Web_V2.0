import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottom: 3,
    borderBottomColor: '#001B55',
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#001B55',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 3,
  },
  registrationNumber: {
    fontSize: 11,
    color: '#001B55',
    fontWeight: 'bold',
    backgroundColor: '#F3F4F6',
    padding: 8,
    marginTop: 10,
    borderRadius: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#001B55',
    marginBottom: 12,
    paddingBottom: 5,
    borderBottom: 2,
    borderBottomColor: '#E5E7EB',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  label: {
    width: '35%',
    fontSize: 10,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  value: {
    width: '65%',
    fontSize: 10,
    color: '#1F2937',
  },
  infoBox: {
    backgroundColor: '#DCFCE7',
    padding: 15,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 4,
    borderLeft: 4,
    borderLeftColor: '#16A34A',
  },
  infoText: {
    fontSize: 9,
    color: '#15803D',
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    borderTop: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 15,
  },
  footerText: {
    fontSize: 8,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 3,
  },
  timestamp: {
    fontSize: 8,
    color: '#6B7280',
    textAlign: 'center',
  },
  statusBadge: {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
    padding: 6,
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    borderRadius: 4,
  },
  programBadge: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
    padding: 8,
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 15,
    borderRadius: 4,
  },
});

interface PIPRegistrationData {
  fullName: string;
  nik: string;
  phone?: string;
  address?: string;
  proposerName?: string;
  category?: string;
  notes?: string;
  registrationNumber?: string;
  submittedAt?: Date;
}

interface Props {
  data: PIPRegistrationData;
}

export const PIPRegistrationPDF: React.FC<Props> = ({ data }) => {
  const formatDateTime = (date?: Date | string) => {
    if (!date) return new Date().toLocaleString('id-ID');
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryLabel = (category?: string) => {
    const categories: Record<string, string> = {
      education: 'Bantuan Pendidikan',
      health: 'Bantuan Kesehatan',
      economy: 'Bantuan Ekonomi',
      infrastructure: 'Bantuan Infrastruktur',
      other: 'Lainnya',
    };
    return categories[category || ''] || category || '-';
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>BUKTI PENDAFTARAN PIP</Text>
          <Text style={styles.subtitle}>Program Inovasi Perubahan</Text>
          <Text style={styles.subtitle}>DPD Partai NasDem Sidoarjo</Text>
          <Text style={styles.subtitle}>Jl. Pahlawan, Sidoarjo, Jawa Timur</Text>
          <Text style={styles.registrationNumber}>
            No. Registrasi: {data.registrationNumber || 'PIP-' + Date.now().toString(36).toUpperCase()}
          </Text>
        </View>

        {/* Status Badge */}
        <View style={styles.statusBadge}>
          <Text>STATUS: TERDAFTAR - MENUNGGU VERIFIKASI</Text>
        </View>

        {/* Program Badge */}
        <View style={styles.programBadge}>
          <Text>📋 KATEGORI PROGRAM: {getCategoryLabel(data.category)}</Text>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            ✓ Terima kasih telah mendaftar sebagai penerima Program Inovasi Perubahan (PIP).{'\n'}
            ✓ Data Anda akan diverifikasi oleh tim NasDem Sidoarjo dalam 3-7 hari kerja.{'\n'}
            ✓ Simpan dokumen ini sebagai bukti pendaftaran resmi.{'\n'}
            ✓ Anda akan dihubungi jika memenuhi kriteria program bantuan.{'\n'}
            ✓ Untuk informasi lebih lanjut, hubungi kantor DPD NasDem Sidoarjo.
          </Text>
        </View>

        {/* Data Calon Penerima */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATA CALON PENERIMA MANFAAT</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nama Lengkap</Text>
            <Text style={styles.value}>{data.fullName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>NIK</Text>
            <Text style={styles.value}>{data.nik}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>No. Telepon</Text>
            <Text style={styles.value}>{data.phone || '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Alamat Lengkap</Text>
            <Text style={styles.value}>{data.address || '-'}</Text>
          </View>
        </View>

        {/* Informasi Pengusul */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMASI PENGUSUL</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nama Pengusul</Text>
            <Text style={styles.value}>{data.proposerName || '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Kategori Bantuan</Text>
            <Text style={styles.value}>{getCategoryLabel(data.category)}</Text>
          </View>
        </View>

        {/* Keterangan Tambahan */}
        {data.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>KETERANGAN / ALASAN PENGAJUAN</Text>
            <Text style={styles.value}>{data.notes}</Text>
          </View>
        )}

        {/* Informasi Penting */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>KETENTUAN PROGRAM PIP</Text>
          <Text style={[styles.value, { marginBottom: 5 }]}>
            • Data yang diberikan harus valid dan dapat dipertanggungjawabkan
          </Text>
          <Text style={[styles.value, { marginBottom: 5 }]}>
            • Penerima manfaat akan dipilih berdasarkan kriteria dan kuota yang tersedia
          </Text>
          <Text style={[styles.value, { marginBottom: 5 }]}>
            • Keputusan tim verifikasi bersifat mutlak dan tidak dapat diganggu gugat
          </Text>
          <Text style={[styles.value, { marginBottom: 5 }]}>
            • Bantuan bersifat hibah dan tidak perlu dikembalikan
          </Text>
          <Text style={styles.value}>
            • Penyalahgunaan data atau manipulasi akan dikenakan sanksi sesuai hukum yang berlaku
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Dokumen ini dibuat secara otomatis oleh sistem pendaftaran online PIP
          </Text>
          <Text style={styles.footerText}>
            DPD Partai NasDem Sidoarjo | www.nasdem-sidoarjo.id | PIP Program 2024
          </Text>
          <Text style={styles.timestamp}>
            Dicetak pada: {formatDateTime(data.submittedAt)}
          </Text>
        </View>
      </Page>
    </Document>
  );
};
