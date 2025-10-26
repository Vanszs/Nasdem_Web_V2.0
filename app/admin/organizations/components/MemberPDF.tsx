"use client";
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import type { Member } from "../types";

interface Props {
  member: Member;
  departmentConfig: any;
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 24,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#111827",
  },
  header: {
    borderBottom: "2px solid #001B55",
    paddingBottom: 6,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  title: { fontSize: 14, fontWeight: 700, color: "#001B55" },
  subtitle: { fontSize: 10, color: "#374151", marginTop: 2 },
  section: {
    border: "1px solid #E5E7EB",
    borderRadius: 6,
    marginBottom: 8,
    overflow: "hidden",
  },
  sectionHeader: {
    backgroundColor: "#E8F9FF",
    borderBottom: "1px solid #E5E7EB",
    paddingVertical: 6,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 10, fontWeight: 700, color: "#001B55" },
  sectionBody: { padding: 8 },
  grid: { flexDirection: "row", gap: 8 },
  col: { flex: 1 },
  label: { fontSize: 8, color: "#6B7280", marginBottom: 2 },
  value: { fontSize: 10, fontWeight: 600, color: "#001B55" },
  text: { fontSize: 10, color: "#374151" },
  badgeRow: { flexDirection: "row", gap: 6, marginTop: 4 },
  badge: {
    fontSize: 8,
    color: "#ffffff",
    backgroundColor: "#001B55",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  statusBadge: {
    fontSize: 8,
    color: "#ffffff",
    backgroundColor: "#10B981",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  row: { flexDirection: "row", gap: 6, alignItems: "flex-start" },
  ktpImage: { width: "100%", height: 160, objectFit: "cover" },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#001B55",
    objectFit: "cover",
  },
  profileInfo: { flex: 1 },
});

export function MemberPDF({ member, departmentConfig }: Props) {
  const joinDate = new Date(member.joinDate).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const deptLabel =
    departmentConfig?.[member.department]?.label || member.department;

  const benefits = Array.isArray(member.benefits)
    ? member.benefits.slice(0, 6)
    : [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>DPD PARTAI NASDEM SIDOARJO</Text>
            <Text style={styles.subtitle}>Biodata Anggota</Text>
          </View>
          <Text style={styles.subtitle}>
            Dicetak:{" "}
            {new Date().toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </Text>
        </View>

        {/* Profile summary */}
        <View style={[styles.section, { padding: 8 }]}>
          <View style={styles.profileRow}>
            {member.photo ? (
              <Image src={member.photo} style={styles.profileImage} />
            ) : null}
            <View style={styles.profileInfo}>
              <Text style={{ fontSize: 12, fontWeight: 700, color: "#001B55" }}>
                {member.name}
              </Text>
              <Text style={{ fontSize: 10, color: "#374151", marginTop: 2 }}>
                {member.position || "-"}
              </Text>
              <View style={styles.badgeRow}>
                <Text style={styles.badge}>{deptLabel}</Text>
                <Text
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        member.status === "active" ? "#10B981" : "#6B7280",
                    },
                  ]}
                >
                  {member.status === "active" ? "Aktif" : "Tidak Aktif"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Main grid: left/right */}
        <View style={[styles.grid, { marginBottom: 8 }]}>
          {/* Left column */}
          <View style={styles.col}>
            {/* Identitas */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Data Identitas</Text>
              </View>
              <View style={styles.sectionBody}>
                <View style={styles.grid}>
                  <View style={styles.col}>
                    <Text style={styles.label}>NIK</Text>
                    <Text style={styles.value}>{member.nik || "-"}</Text>
                  </View>
                  <View style={styles.col}>
                    <Text style={styles.label}>No. KTA</Text>
                    <Text style={styles.value}>{member.ktaNumber || "-"}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 6 }}>
                  <Text style={styles.label}>Tanggal Bergabung</Text>
                  <Text style={styles.text}>{joinDate}</Text>
                </View>
              </View>
            </View>

            {/* Kontak */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Informasi Kontak</Text>
              </View>
              <View style={styles.sectionBody}>
                <View style={{ marginBottom: 6 }}>
                  <Text style={styles.label}>Email</Text>
                  <Text style={styles.text}>{member.email || "-"}</Text>
                </View>
                <View style={{ marginBottom: 6 }}>
                  <Text style={styles.label}>Telepon</Text>
                  <Text style={styles.text}>{member.phone || "-"}</Text>
                </View>
                <View>
                  <Text style={styles.label}>Alamat Lengkap</Text>
                  <Text style={styles.text}>{member.address || "-"}</Text>
                </View>
              </View>
            </View>

            {/* Keluarga */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Data Keluarga</Text>
              </View>
              <View style={styles.sectionBody}>
                <View style={styles.grid}>
                  <View style={styles.col}>
                    <Text style={styles.label}>Status Perkawinan</Text>
                    <Text style={styles.text}>
                      {member.maritalStatus || "-"}
                    </Text>
                  </View>
                  <View style={styles.col}>
                    <Text style={styles.label}>Jumlah Keluarga</Text>
                    <Text style={styles.text}>
                      {member.familyCount ? `${member.familyCount} orang` : "-"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Right column */}
          <View style={styles.col}>
            {/* Deskripsi */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Biodata & Deskripsi</Text>
              </View>
              <View style={styles.sectionBody}>
                <Text style={styles.text}>
                  {member.description || "Belum ada deskripsi"}
                </Text>
              </View>
            </View>

            {/* Program & Bantuan */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Program & Bantuan</Text>
              </View>
              <View style={styles.sectionBody}>
                {benefits.length > 0 ? (
                  <View style={{ gap: 4 }}>
                    {benefits.map((b, idx) => (
                      <View key={idx} style={styles.row}>
                        <Text style={{ fontSize: 10, color: "#001B55" }}>
                          •
                        </Text>
                        <Text style={styles.text}>{b}</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={[styles.text, { fontStyle: "italic" }]}>
                    Belum ada data
                  </Text>
                )}
              </View>
            </View>

            {/* Foto KTP */}
            {member.ktpPhotoUrl ? (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Foto KTP</Text>
                </View>
                <View style={styles.sectionBody}>
                  {/* Note: Image must be accessible via URL; if blocked by CORS, it may not render */}
                  <Image src={member.ktpPhotoUrl} style={styles.ktpImage} />
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default MemberPDF;
