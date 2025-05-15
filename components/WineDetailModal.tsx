import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, Image, TouchableOpacity, ScrollView, Dimensions, Share, Platform } from 'react-native';
import { Wine } from '@/types/wine';
import Colors from '@/constants/colors';
import { X, Edit, MessageCircle } from 'lucide-react-native';
import WineEditModal from './WineEditModal';

interface WineDetailModalProps {
  wine: Wine | null;
  visible: boolean;
  onClose: () => void;
  onUpdate?: (updatedWine: Wine) => void;
}

const { width } = Dimensions.get('window');

export default function WineDetailModal({ wine, visible, onClose, onUpdate }: WineDetailModalProps) {
  const [editModalVisible, setEditModalVisible] = useState(false);

  if (!wine) return null;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this amazing wine: ${wine.name} (${wine.year}) from ${wine.region}, ${wine.country}`,
        title: `${wine.name} - dBarrique Wine Collection`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = () => {
    setEditModalVisible(true);
  };

  const handleSaveEdit = (updatedWine: Wine) => {
    if (onUpdate) {
      onUpdate(updatedWine);
    }
    setEditModalVisible(false);
  };

  const DetailItem = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  return (
    <>
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={Colors.dark.text} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Edit size={20} color={Colors.dark.text} />
            </TouchableOpacity>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>{wine.name}</Text>
              <Text style={styles.subtitle}>{wine.region}, {wine.country}, {wine.year}</Text>
              
              <View style={styles.imageContainer}>
                <Image source={{ uri: wine.image }} style={styles.image} resizeMode="contain" />
              </View>
              
              <View style={styles.detailsContainer}>
                <View style={styles.detailsColumn}>
                  <Text style={styles.sectionTitle}>DETTAGLI</Text>
                  <DetailItem label="Cantina" value={wine.details.winery} />
                  <DetailItem label="Tipo" value={wine.details.type} />
                  <DetailItem label="Vitigno" value={wine.details.grape} />
                </View>
                
                <View style={styles.detailsColumn}>
                  <Text style={styles.sectionTitle}>CARATTERISTICHE</Text>
                  <DetailItem label="Corpo" value={wine.details.body} />
                  <DetailItem label="Struttura" value={wine.details.structure} />
                  <DetailItem label="Tannini" value={wine.details.tannins} />
                  <DetailItem label="Dolcezza" value={wine.details.sweetness} />
                  <DetailItem label="Aroma" value={wine.details.aroma} />
                </View>
              </View>
              
              <View style={styles.descriptionContainer}>
                <Text style={styles.sectionTitle}>DESCRIZIONE</Text>
                <Text style={styles.description}>{wine.details.description}</Text>
              </View>
              
              <View style={styles.detailsContainer}>
                <View style={styles.detailsColumn}>
                  <Text style={styles.sectionTitle}>ABBINAMENTI</Text>
                  <Text style={styles.pairings}>{wine.details.pairings}</Text>
                </View>
                
                <View style={styles.detailsColumn}>
                  <Text style={styles.sectionTitle}>CONSERVAZIONE</Text>
                  <Text style={styles.conservation}>{wine.details.conservation}</Text>
                </View>
              </View>
              
              <View style={styles.shareContainer}>
                <TouchableOpacity 
                  style={[styles.shareButton, styles.whatsappButton]}
                  onPress={handleShare}
                >
                  <MessageCircle size={20} color="#fff" />
                  <Text style={styles.shareButtonText}>WhatsApp</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.shareButton, styles.telegramButton]}
                  onPress={handleShare}
                >
                  <MessageCircle size={20} color="#fff" />
                  <Text style={styles.shareButtonText}>Telegram</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <WineEditModal 
        wine={wine}
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSave={handleSaveEdit}
      />
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width > 600 ? '70%' : '90%',
    maxHeight: '90%',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 20,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  editButton: {
    position: 'absolute',
    top: 16,
    right: 56,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.dark.subtext,
    marginTop: 4,
    marginBottom: 20,
  },
  imageContainer: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 20,
  },
  detailsColumn: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.dark.subtext,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.dark.subtext,
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    color: Colors.dark.text,
    flex: 1,
  },
  descriptionContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 20,
  },
  description: {
    fontSize: 14,
    color: Colors.dark.text,
    lineHeight: 22,
  },
  pairings: {
    fontSize: 14,
    color: Colors.dark.text,
    lineHeight: 22,
  },
  conservation: {
    fontSize: 14,
    color: Colors.dark.text,
    lineHeight: 22,
  },
  shareContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  telegramButton: {
    backgroundColor: '#0088cc',
  },
  shareButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
  },
});