import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Modal, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Image,
  Platform,
  Dimensions
} from 'react-native';
import { Wine } from '@/types/wine';
import Colors from '@/constants/colors';
import { X, Camera, Trash2, Plus, Minus } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

interface WineEditModalProps {
  wine: Wine | null;
  visible: boolean;
  onClose: () => void;
  onSave: (updatedWine: Wine) => void;
}

const { width } = Dimensions.get('window');

// Wine characteristics options
const wineCharacteristics = {
  body: ['Leggero', 'Medio', 'Corposo'],
  structure: ['Semplice', 'Equilibrato', 'Complesso'],
  tannins: ['Leggeri', 'Equilibrato', 'Intensi'],
  sweetness: ['Secco', 'Abboccato', 'Amabile', 'Dolce'],
  aroma: ['Fruttato', 'Floreale', 'Speziato', 'Erbaceo', 'Minerale']
};

export default function WineEditModal({ wine, visible, onClose, onSave }: WineEditModalProps) {
  const [editedWine, setEditedWine] = useState<Wine | null>(null);
  const [rating, setRating] = useState<number>(0);

  useEffect(() => {
    if (wine) {
      setEditedWine({ ...wine });
      setRating(wine.rating);
    }
  }, [wine]);

  if (!editedWine) return null;

  const handleTextChange = (field: string, value: string) => {
    setEditedWine(prev => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  };

  const handleDetailChange = (field: string, value: string) => {
    setEditedWine(prev => {
      if (!prev) return prev;
      return { 
        ...prev, 
        details: {
          ...prev.details,
          [field]: value
        }
      };
    });
  };

  const handleSave = () => {
    if (editedWine) {
      onSave({
        ...editedWine,
        rating
      });
    }
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setEditedWine(prev => {
        if (!prev) return prev;
        return { ...prev, image: result.assets[0].uri };
      });
    }
  };

  const handleRatingChange = (newRating: number) => {
    setRating(Math.max(1, Math.min(10, newRating)));
  };

  // Characteristic selector component
  const CharacteristicSelector = ({ 
    label, 
    options, 
    value, 
    onChange 
  }: { 
    label: string, 
    options: string[], 
    value: string, 
    onChange: (value: string) => void 
  }) => {
    return (
      <View style={styles.characteristicContainer}>
        <Text style={styles.characteristicLabel}>{label}</Text>
        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                value === option && styles.optionButtonSelected
              ]}
              onPress={() => onChange(option)}
            >
              <Text 
                style={[
                  styles.optionText,
                  value === option && styles.optionTextSelected
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={Colors.dark.text} />
          </TouchableOpacity>
          
          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
            <Text style={styles.modalTitle}>Modifica</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                value={editedWine.name}
                onChangeText={(text) => handleTextChange('name', text)}
                placeholderTextColor={Colors.dark.subtext}
                placeholder="Nome del vino"
              />
            </View>
            
            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Regione, Italia</Text>
                <TextInput
                  style={styles.input}
                  value={editedWine.region}
                  onChangeText={(text) => handleTextChange('region', text)}
                  placeholderTextColor={Colors.dark.subtext}
                  placeholder="Regione"
                />
              </View>
              <View style={[styles.formGroup, { width: 100 }]}>
                <Text style={styles.label}>Anno</Text>
                <TextInput
                  style={styles.input}
                  value={editedWine.year.toString()}
                  onChangeText={(text) => handleTextChange('year', text)}
                  keyboardType="number-pad"
                  placeholderTextColor={Colors.dark.subtext}
                  placeholder="Anno"
                />
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Cantina</Text>
              <TextInput
                style={styles.input}
                value={editedWine.details.winery}
                onChangeText={(text) => handleDetailChange('winery', text)}
                placeholderTextColor={Colors.dark.subtext}
                placeholder="Cantina"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Vitigno</Text>
              <TextInput
                style={styles.input}
                value={editedWine.details.grape}
                onChangeText={(text) => handleDetailChange('grape', text)}
                placeholderTextColor={Colors.dark.subtext}
                placeholder="Vitigno"
              />
            </View>
            
            <View style={styles.characteristicsSection}>
              <Text style={styles.sectionTitle}>Caratteristiche del Vino</Text>
              
              <CharacteristicSelector 
                label="Corpo" 
                options={wineCharacteristics.body} 
                value={editedWine.details.body} 
                onChange={(value) => handleDetailChange('body', value)} 
              />
              
              <CharacteristicSelector 
                label="Struttura" 
                options={wineCharacteristics.structure} 
                value={editedWine.details.structure} 
                onChange={(value) => handleDetailChange('structure', value)} 
              />
              
              <CharacteristicSelector 
                label="Tannini" 
                options={wineCharacteristics.tannins} 
                value={editedWine.details.tannins} 
                onChange={(value) => handleDetailChange('tannins', value)} 
              />
              
              <CharacteristicSelector 
                label="Dolcezza" 
                options={wineCharacteristics.sweetness} 
                value={editedWine.details.sweetness} 
                onChange={(value) => handleDetailChange('sweetness', value)} 
              />
              
              <CharacteristicSelector 
                label="Aroma/Profumo" 
                options={wineCharacteristics.aroma} 
                value={editedWine.details.aroma} 
                onChange={(value) => handleDetailChange('aroma', value)} 
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Descrizione</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editedWine.details.description}
                onChangeText={(text) => handleDetailChange('description', text)}
                placeholderTextColor={Colors.dark.subtext}
                placeholder="Descrizione del vino"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Abbinamenti</Text>
              <TextInput
                style={styles.input}
                value={editedWine.details.pairings}
                onChangeText={(text) => handleDetailChange('pairings', text)}
                placeholderTextColor={Colors.dark.subtext}
                placeholder="Brasati, tartufi, formaggi stagionati"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Conservazione</Text>
              <TextInput
                style={styles.input}
                value={editedWine.details.conservation}
                onChangeText={(text) => handleDetailChange('conservation', text)}
                placeholderTextColor={Colors.dark.subtext}
                placeholder="15-30 anni in condizioni ottimali"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Immagine</Text>
              <View style={styles.imageContainer}>
                {editedWine.image ? (
                  <View style={styles.imagePreview}>
                    <Image source={{ uri: editedWine.image }} style={styles.previewImage} />
                    <TouchableOpacity style={styles.removeImageButton} onPress={() => setEditedWine({...editedWine, image: ''})}>
                      <Trash2 size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                    <Camera size={24} color={Colors.dark.text} />
                    <Text style={styles.addImageText}>Aggiungi immagine</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            
            <View style={styles.ratingContainer}>
              <Text style={styles.label}>Rating: {rating}/10</Text>
              <View style={styles.ratingControls}>
                <TouchableOpacity 
                  style={styles.ratingButton} 
                  onPress={() => handleRatingChange(rating - 1)}
                >
                  <Minus size={20} color={Colors.dark.text} />
                </TouchableOpacity>
                
                <View style={styles.ratingBar}>
                  <View style={[styles.ratingFill, { width: `${(rating / 10) * 100}%` }]} />
                </View>
                
                <TouchableOpacity 
                  style={styles.ratingButton} 
                  onPress={() => handleRatingChange(rating + 1)}
                >
                  <Plus size={20} color={Colors.dark.text} />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Annulla</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Salva Modifiche</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width > 600 ? '70%' : '95%',
    maxHeight: '95%',
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    position: 'relative',
  },
  scrollView: {
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 20,
    marginTop: 10,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: Colors.dark.subtext,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    padding: 12,
    color: Colors.dark.text,
    fontSize: 14,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  characteristicsSection: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 16,
  },
  characteristicContainer: {
    marginBottom: 16,
  },
  characteristicLabel: {
    fontSize: 14,
    color: Colors.dark.text,
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 4,
    marginBottom: 8,
  },
  optionButtonSelected: {
    backgroundColor: Colors.dark.accent,
  },
  optionText: {
    fontSize: 14,
    color: Colors.dark.subtext,
  },
  optionTextSelected: {
    color: Colors.dark.text,
    fontWeight: 'bold',
  },
  imageContainer: {
    marginTop: 8,
  },
  imagePreview: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: 4,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(178, 34, 34, 0.8)',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButton: {
    width: '100%',
    height: 120,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderStyle: 'dashed',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    color: Colors.dark.subtext,
    marginTop: 8,
  },
  ratingContainer: {
    marginBottom: 24,
  },
  ratingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#2a2a2a',
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  ratingFill: {
    height: '100%',
    backgroundColor: Colors.dark.accent,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    marginBottom: 40,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    marginRight: 12,
  },
  cancelButtonText: {
    color: Colors.dark.subtext,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: Colors.dark.accent,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  saveButtonText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});