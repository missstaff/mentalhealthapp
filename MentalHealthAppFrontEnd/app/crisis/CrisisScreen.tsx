// CrisisScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getCrisisDocuments } from "../../api/crisis";
import { crisisDocumentModel } from "@/models/crisisDocumentModel";
import { userContactModel } from "@/models/userContactModel";
import { getUserContacts } from "@/api/userContacts";
import { getCurrentUser } from "@/api/auth";
import { useThemeContext } from "@/components/ThemeContext";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 60) / 2;

const CrisisScreen = () => {
  const { theme } = useThemeContext();
  const styles = createStyles(theme);
  
  const [crisisDocuments, setCrisisDocuments] = useState<
    crisisDocumentModel[] | null
  >(null);
  const [userContacts, setUserContacts] = useState<userContactModel[] | null>(
    null
  );
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        const [documents, contacts] = await Promise.all([
          getCrisisDocuments(),
          getUserContacts(currentUser.uid),
        ]);

        setCrisisDocuments(documents);
        setUserContacts(contacts);
      } catch (error) {
        console.error("Error initializing crisis screen:", error);
        Alert.alert(
          "Initialization Error",
          "There was a problem loading the crisis resources. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, []);

  const makePhoneCall = (number: string) => {
    const url = `tel:${number}`;
    Linking.openURL(url).catch((err) =>
      Alert.alert("Call Error", "Unable to make a call at this time.")
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <Text style={styles.header}>Crisis Support</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        <View style={styles.buttonContainer}>
          <CallButton
            iconName="phone"
            title="Suicide Hotline"
            phoneNumber="1234567890"
            onPress={() => makePhoneCall("1234567890")}
            styles={styles}
          />
          <CallButton
            iconName="local-hospital"
            title="Emergency Services"
            phoneNumber="911"
            onPress={() => makePhoneCall("911")}
            styles={styles}
          />
          {userContacts &&
            userContacts.length > 0 &&
            userContacts.map((contact) => (
              <CallButton
                key={contact.contactId}
                iconName="person"
                title={contact.contactName}
                phoneNumber={contact.phoneNumber}
                onPress={() => makePhoneCall(contact.phoneNumber)}
                styles={styles}
              />
            ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Crisis Documents</Text>
        {crisisDocuments && crisisDocuments.length > 0 ? (
          <View style={styles.cardGrid}>
            {crisisDocuments.map((document) => (
              <DocumentCard 
                document={document}
                styles={styles} />
            ))}
          </View>
        ) : (
          <Text style={styles.noDataText}>
            No documents available at the moment.
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

interface CallButtonProps {
  iconName: string;
  title: string;
  phoneNumber: string;
  onPress: () => void;
  styles: any;
}

const CallButton: React.FC<CallButtonProps> = ({
  iconName,
  title,
  onPress,
  styles
}) => (
  <TouchableOpacity
    style={styles.callButton}
    onPress={onPress}
    accessibilityLabel={title}
  >
    <Icon name={iconName} size={20} color="#fff" style={styles.buttonIcon} />
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

interface DocumentCardProps {
  document: crisisDocumentModel;
  styles: any;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, styles }) => (
  <TouchableOpacity
    style={styles.card}
    onPress={() => Linking.openURL(document.link)}
    accessibilityLabel={`Read more about ${document.title}`}
  >
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{document.title}</Text>
      <Text style={styles.cardDescription} numberOfLines={3}>
        {document.description}
      </Text>
    </View>
    <Icon
      name="arrow-forward-ios"
      size={16}
      color="#6200EE"
      style={styles.cardIcon}
    />
  </TouchableOpacity>
);

const createStyles = (theme: string) => {
  const isDark = theme === 'dark';
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#121212' : '#E8F0FE',
      padding: 20,
    },
    loadingContainer: {
      flex: 1,
      backgroundColor: isDark ? '#1e1e1e' : '#E8F0FE',
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      fontSize: 28,
      fontWeight: '700',
      marginBottom: 25,
      textAlign: 'center',
      color: isDark ? '#bb86fc' : '#1A237E',
    },
    section: {
      marginBottom: 30,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 15,
      color: isDark ? '#bb86fc' : '#303F9F',
    },
    buttonContainer: {
      flexDirection: 'column',
    },
    callButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#2b2b8a' : '#3949AB',
      paddingVertical: 12,
      paddingHorizontal: 15,
      marginVertical: 6,
      borderRadius: 10,
      elevation: 2,
    },
    buttonIcon: {
      marginRight: 10,
    },
    buttonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 16,
    },
    cardGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    card: {
      backgroundColor: isDark ? '#1e1e1e' : '#fff',
      padding: 15,
      borderRadius: 12,
      marginBottom: 15,
      width: CARD_WIDTH,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: isDark ? '#000' : '#000',
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    cardContent: {
      flex: 1,
      paddingRight: 10,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: isDark ? '#bb86fc' : '#1A237E',
      marginBottom: 5,
    },
    cardDescription: {
      fontSize: 12,
      color: isDark ? '#cccccc' : '#555',
      lineHeight: 18,
    },
    cardIcon: {
      marginLeft: 5,
    },
    noDataText: {
      fontSize: 16,
      color: isDark ? '#888888' : '#888',
      textAlign: 'center',
      marginTop: 10,
    },
  });
};


export default CrisisScreen;
