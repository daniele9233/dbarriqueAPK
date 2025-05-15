import React, { useState } from 'react';
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
  Dimensions,
} from 'react-native';
import { Wine, X, Upload, Camera } from 'lucide-react-native';
import Colors from '@/constants/colors';
import * as ImagePicker from 'expo-image-picker';
import { Wine as WineType } from '@/types/wine';

interface AddWineModalProps {
  visible: boolean;
  onClose: () => void;
  onAddWine: (wine: WineType) => void;
}

const { width } = Dimensions.get('window');

// Grape varieties list
const grapeVarieties = [
  'Aglianico', 'Barbera', 'Cabernet Sauvignon', 'Cannonau',
  'Carignano', 'Carmenère', 'Corvina', 'Dolcetto',
  'Lagrein', 'Lambrusco', 'Malvasia Nera', 'Montepulciano',
  'Nebbiolo', 'Primitivo', 'Sangiovese', 'Syrah'
];

// Wine characteristics options
const wineCharacteristics = {
  body: ['Leggero', 'Medio', 'Corposo'],
  structure: ['Semplice', 'Equilibrato', 'Complesso'],
  tannins: ['Leggeri', 'Equilibrato', 'Intensi'],
  sweetness: ['Secco', 'Abboccato', 'Amabile', 'Dolce'],
  aroma: ['Fruttato', 'Floreale', 'Speziato', 'Erbaceo', 'Minerale']
};

export default function AddWineModal({ visible, onClose, onAddWine }: AddWineModalProps) {
  const [name, setName] = useState('');
  const [winery, setWinery] = useState('');
  const [region, setRegion] = useState('');
  const [selectedGrapes, setSelectedGrapes] = useState<string[]>([]);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState(wineCharacteristics.body[1]); // Default to 'Medio'
  const [structure, setStructure] = useState(wineCharacteristics.structure[1]); // Default to 'Equilibrato'
  const [tannins, setTannins] = useState(wineCharacteristics.tannins[1]); // Default to 'Equilibrato'
  const [sweetness, setSweetness] = useState(wineCharacteristics.sweetness[0]); // Default to 'Secco'
  const [aroma, setAroma] = useState(wineCharacteristics.aroma[0]); // Default to 'Fruttato'
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isBlendSelected, setIsBlendSelected] = useState(false);

  const toggleGrape = (grape: string) => {
    if (selectedGrapes.includes(grape)) {
      setSelectedGrapes(selectedGrapes.filter(g => g !== grape));
    } else {
      setSelectedGrapes([...selectedGrapes, grape]);
    }
  };

  const toggleBlend = () => {
    setIsBlendSelected(!isBlendSelected);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAddWine = () => {
    if (!name.trim()) {
      // Show error or alert that name is required
      return;
    }

    // Create a new wine object
    const newWine: WineType = {
      id: Date.now().toString(), // Generate a unique ID
      name,
      region: region || 'Italia',
      country: 'Italia',
      year: parseInt(year) || new Date().getFullYear(),
      type: 'RED', // Default to RED, could be made selectable
      rating,
      image: image || 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // Default image if none selected
      details: {
        winery: winery || '',
        type: 'red', // Default to red, could be made selectable
        grape: isBlendSelected ? 'Blend' : selectedGrapes.join(', ') || 'Sangiovese',
        body,
        structure,
        tannins,
        sweetness,
        aroma,
        description: description || '',
        pairings: '',
        conservation: ''
      }
    };

    onAddWine(newWine);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setWinery('');
    setRegion('');
    setSelectedGrapes([]);
    setYear(new Date().getFullYear().toString());
    setRating(5);
    setBody(wineCharacteristics.body[1]);
    setStructure(wineCharacteristics.structure[1]);
    setTannins(wineCharacteristics.tannins[1]);
    setSweetness(wineCharacteristics.sweetness[0]);
    setAroma(wineCharacteristics.aroma[0]);
    setDescription('');
    setImage('');
    setIsBlendSelected(false);
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
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleContainer}>
              <Wine size={20} color={Colors.dark.accent} />
              <Text style={styles.modalTitle}>Aggiungi Nuovo Vino</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color={Colors.dark.text} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.modalSubtitle}>
            Inserisci i dettagli del vino che desideri aggiungere alla tua collezione. Solo il nome del vino è obbligatorio.
          </Text>
          
          <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nome del Vino <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="es. Brunello di Montalcino"
                placeholderTextColor={Colors.dark.subtext}
                value={name}
                onChangeText={setName}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Cantina</Text>
              <TextInput
                style={styles.input}
                placeholder="es. Biondi-Santi"
                placeholderTextColor={Colors.dark.subtext}
                value={winery}
                onChangeText={setWinery}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Regione</Text>
              <TextInput
                style={styles.input}
                placeholder="es. Toscana, Italia"
                placeholderTextColor={Colors.dark.subtext}
                value={region}
                onChangeText={setRegion}
              />
            </View>
            
            <View style={styles.formGroup}>
              <View style={styles.vitignoHeader}>
                <Text style={styles.label}>Vitigno</Text>
                <TouchableOpacity 
                  style={[styles.blendButton, isBlendSelected && styles.blendButtonSelected]} 
                  onPress={toggleBlend}
                >
                  <Text style={styles.blendButtonText}>Blend (seleziona più vitigni)</Text>
                  {isBlendSelected && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
              
              <View style={styles.grapeGrid}>
                {grapeVarieties.map((grape) => (
                  <TouchableOpacity
                    key={grape}
                    style={[
                      styles.grapeCheckbox,
                      selectedGrapes.includes(grape) && styles.grapeCheckboxSelected
                    ]}
                    onPress={() => toggleGrape(grape)}
                    disabled={isBlendSelected}
                  >
                    <View style={[
                      styles.checkbox,
                      selectedGrapes.includes(grape) && styles.checkboxSelected,
                      isBlendSelected && styles.checkboxDisabled
                    ]}>
                      {selectedGrapes.includes(grape) && !isBlendSelected && (
                        <Text style={styles.checkboxCheck}>✓</Text>
                      )}
                    </View>
                    <Text style={[
                      styles.grapeText,
                      isBlendSelected && styles.grapeTextDisabled
                    ]}>
                      {grape}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Anno</Text>
                <TextInput
                  style={styles.input}
                  placeholder={new Date().getFullYear().toString()}
                  placeholderTextColor={Colors.dark.subtext}
                  value={year}
                  onChangeText={setYear}
                  keyboardType="number-pad"
                />
              </View>
              
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Valutazione (1-10)</Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingValue}>{rating}/10</Text>
                  <View style={styles.ratingButtonsContainer}>
                    <View style={styles.ratingButtonsRow}>
                      {[1, 2, 3, 4, 5].map((value) => (
                        <TouchableOpacity 
                          key={value} 
                          style={[
                            styles.ratingButton,
                            rating === value && styles.ratingButtonActive
                          ]}
                          onPress={() => setRating(value)}
                        >
                          <Text style={[
                            styles.ratingButtonText,
                            rating === value && styles.ratingButtonTextActive
                          ]}>
                            {value}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <View style={styles.ratingButtonsRow}>
                      {[6, 7, 8, 9, 10].map((value) => (
                        <TouchableOpacity 
                          key={value} 
                          style={[
                            styles.ratingButton,
                            rating === value && styles.ratingButtonActive
                          ]}
                          onPress={() => setRating(value)}
                        >
                          <Text style={[
                            styles.ratingButtonText,
                            rating === value && styles.ratingButtonTextActive
                          ]}>
                            {value}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
              </View>
            </View>
            
            <View style={styles.characteristicsSection}>
              <Text style={styles.sectionTitle}>Caratteristiche del Vino</Text>
              
              <CharacteristicSelector 
                label="Corpo" 
                options={wineCharacteristics.body} 
                value={body} 
                onChange={setBody} 
              />
              
              <CharacteristicSelector 
                label="Struttura" 
                options={wineCharacteristics.structure} 
                value={structure} 
                onChange={setStructure} 
              />
              
              <CharacteristicSelector 
                label="Tannini" 
                options={wineCharacteristics.tannins} 
                value={tannins} 
                onChange={setTannins} 
              />
              
              <CharacteristicSelector 
                label="Dolcezza" 
                options={wineCharacteristics.sweetness} 
                value={sweetness} 
                onChange={setSweetness} 
              />
              
              <CharacteristicSelector 
                label="Aromi principali" 
                options={wineCharacteristics.aroma} 
                value={aroma} 
                onChange={setAroma} 
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Descrizione</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Descrivi le caratteristiche del vino..."
                placeholderTextColor={Colors.dark.subtext}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Immagine</Text>
              <TouchableOpacity style={styles.imageUploadContainer} onPress={pickImage}>
                {image ? (
                  <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: image }} style={styles.imagePreview} />
                  </View>
                ) : (
                  <View style={styles.imageUploadPlaceholder}>
                    <Upload size={24} color={Colors.dark.subtext} />
                    <Text style={styles.imageUploadText}>
                      Nessuna immagine caricata. Carica un'immagine per iniziare.
                    </Text>
                    <Text style={styles.imageFormatText}>
                      Formato massimo: 10MB. Supportati: JPG, PNG, WebP.
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Annulla</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.addButton, !name.trim() && styles.addButtonDisabled]} 
                onPress={handleAddWine}
                disabled={!name.trim()}
              >
                <Text style={styles.addButtonText}>Aggiungi alla Collezione</Text>
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
    maxHeight: '90%',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginLeft: 8,
  },
  closeButton: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.dark.subtext,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  formContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  label: {
    fontSize: 14,
    color: Colors.dark.text,
    marginBottom: 8,
    fontWeight: '500',
  },
  required: {
    color: Colors.dark.accent,
  },
  input: {
    backgroundColor: '#121212',
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
  vitignoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  blendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginTop: 4,
  },
  blendButtonSelected: {
    backgroundColor: 'rgba(178, 34, 34, 0.2)',
  },
  blendButtonText: {
    fontSize: 12,
    color: Colors.dark.subtext,
    marginRight: 8,
  },
  checkmark: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.dark.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: Colors.dark.text,
    fontSize: 10,
    fontWeight: 'bold',
  },
  grapeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  grapeCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  grapeCheckboxSelected: {
    backgroundColor: 'rgba(178, 34, 34, 0.1)',
    borderRadius: 4,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: Colors.dark.accent,
    borderColor: Colors.dark.accent,
  },
  checkboxDisabled: {
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  checkboxCheck: {
    color: Colors.dark.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
  grapeText: {
    fontSize: 14,
    color: Colors.dark.text,
  },
  grapeTextDisabled: {
    color: Colors.dark.subtext,
  },
  ratingContainer: {
    alignItems: 'center',
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    padding: 12,
  },
  ratingValue: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingButtonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  ratingButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 4,
    width: '100%',
    paddingHorizontal: 10,
  },
  ratingButton: {
    width: '18%',
    aspectRatio: 1,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '1%',
  },
  ratingButtonActive: {
    backgroundColor: Colors.dark.accent,
  },
  ratingButtonText: {
    fontSize: 12,
    color: Colors.dark.subtext,
  },
  ratingButtonTextActive: {
    color: Colors.dark.text,
    fontWeight: 'bold',
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
  imageUploadContainer: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  imagePreviewContainer: {
    height: 200,
    width: '100%',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageUploadPlaceholder: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imageUploadText: {
    color: Colors.dark.subtext,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  imageFormatText: {
    color: Colors.dark.subtext,
    fontSize: 12,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: Colors.dark.text,
    fontSize: 14,
  },
  addButton: {
    flex: 1,
    padding: 12,
    borderRadius: 4,
    backgroundColor: Colors.dark.accent,
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: 'rgba(178, 34, 34, 0.5)',
  },
  addButtonText: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
});