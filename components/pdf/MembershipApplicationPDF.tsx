import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

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
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
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
    backgroundColor: '#EFF6FF',
    padding: 15,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 4,
    borderLeft: 4,
    borderLeftColor: '#001B55',
  },
  infoText: {
    fontSize: 9,
    color: '#1E40AF',
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
    backgroundColor: '#FEF3C7',
    color: '#92400E',
    padding: 6,
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    borderRadius: 4,
  },
});

interface MembershipApplicationData {
  fullName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  nik: string;
  address?: string;
  occupation?: string;
  notes?: string;
  isBeneficiary?: boolean;
  beneficiaryProgramName?: string;
  registrationNumber?: string;
  submittedAt?: Date;
}

interface Props {
  data: MembershipApplicationData;
}

export const MembershipApplicationPDF: React.FC<Props> = ({ data }) => {
  const formatDate = (date?: Date | string) => {
    if (!date) return '-';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

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

  const getGenderLabel = (gender?: string) => {
    if (!gender) return '-';
    return gender === 'male' ? 'Laki-laki' : gender === 'female' ? 'Perempuan' : gender;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>BUKTI PENDAFTARAN ANGGOTA</Text>
          <Text style={styles.subtitle}>DPD Partai NasDem Sidoarjo</Text>
          <Text style={styles.subtitle}>Jl. Pahlawan, Sidoarjo, Jawa Timur</Text>
          <Text style={styles.registrationNumber}>
            No. Registrasi: {data.registrationNumber || 'NASDEM-' + Date.now().toString(36).toUpperCase()}
          </Text>
        </View>

        {/* Status Badge */}
        <View style={styles.statusBadge}>
          <Text>STATUS: MENUNGGU VERIFIKASI</Text>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            ✓ Terima kasih telah mendaftar sebagai anggota Partai NasDem Sidoarjo.{'\n'}
            ✓ Permohonan Anda akan diproses oleh tim kami dalam 3-5 hari kerja.{'\n'}
            ✓ Simpan dokumen ini sebagai bukti pendaftaran.{'\n'}
            ✓ Anda akan dihubungi melalui email/telepon untuk informasi lebih lanjut.
          </Text>
        </View>

        {/* Data Pribadi */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATA PRIBADI</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nama Lengkap</Text>
            <Text style={styles.value}>{data.fullName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>NIK</Text>
            <Text style={styles.value}>{data.nik}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tanggal Lahir</Text>
            <Text style={styles.value}>{formatDate(data.dateOfBirth)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Jenis Kelamin</Text>
            <Text style={styles.value}>{getGenderLabel(data.gender)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Pekerjaan</Text>
            <Text style={styles.value}>{data.occupation || '-'}</Text>
          </View>
        </View>

        {/* Kontak */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMASI KONTAK</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{data.email || '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>No. Telepon</Text>
            <Text style={styles.value}>{data.phone || '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Alamat</Text>
            <Text style={styles.value}>{data.address || '-'}</Text>
          </View>
        </View>

        {/* Penerima Manfaat */}
        {data.isBeneficiary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>INFORMASI PENERIMA MANFAAT</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Status</Text>
              <Text style={styles.value}>Penerima Manfaat Program</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Program</Text>
              <Text style={styles.value}>{data.beneficiaryProgramName || '-'}</Text>
            </View>
          </View>
        )}

        {/* Motivasi */}
        {data.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>MOTIVASI BERGABUNG</Text>
            <Text style={styles.value}>{data.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Dokumen ini dibuat secara otomatis oleh sistem pendaftaran online
          </Text>
          <Text style={styles.footerText}>
            DPD Partai NasDem Sidoarjo | www.nasdem-sidoarjo.id
          </Text>
          <Text style={styles.timestamp}>
            Dicetak pada: {formatDateTime(data.submittedAt)}
          </Text>
        </View>
      </Page>
    </Document>
  );
};
