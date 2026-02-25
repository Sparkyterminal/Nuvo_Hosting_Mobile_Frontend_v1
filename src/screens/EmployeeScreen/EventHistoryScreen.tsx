import React from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import { BaseContainer } from '../../components/BaseContainer';
import ScreenHeader from '../../components/ScreenHeader';
import CustomText from '../../components/CustomText';
import { AppColors } from '../../theme/colors';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const historyEvents = [
  {
    id: 'h1',
    title: 'South Indian Style Wedding',
    date: '24 April, 2023. 10:00 PM',
    venue: 'Grand Palace. Bangalore',
    image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
    status: 'Completed',
  },
  {
    id: 'h2',
    title: 'Mehendi Ceremony',
    date: '02 May, 2024. 04:00 PM',
    venue: 'Royal Orchid. Mysore',
    image:
      'https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=800&auto=format&fit=crop',
    status: 'Completed',
  },
];

const EventHistoryScreen = ({ navigation }) => {
  const renderEvent = ({ item }: any) => {
    return (
      <View style={styles.eventCard}>
        <Image
          source={{ uri: item.image }}
          style={styles.eventImage}
        />

        <View style={{ flex: 1 }}>
          <View style={styles.eventHeaderRow}>
            <CustomText
              weight="bold"
              style={styles.eventTitle}
              numberOfLines={2}
            >
              {item.title}
            </CustomText>

            <View style={styles.badge}>
              <CustomText variant="caption">{item.status}</CustomText>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="calendar"
              size={18}
              color={AppColors.primary}
            />
            <View style={{ marginLeft: 8 }}>
              <CustomText
                variant="caption"
                color={AppColors.textSecondary}
              >
                Date & Time
              </CustomText>
              <CustomText>{item.date}</CustomText>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="location-outline"
              size={18}
              color={AppColors.primary}
            />
            <View style={{ marginLeft: 8 }}>
              <CustomText
                variant="caption"
                color={AppColors.textSecondary}
              >
                Event Venue
              </CustomText>
              <CustomText>{item.venue}</CustomText>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <BaseContainer>
      <ScreenHeader
        title="History"
        onBackPress={() => navigation.goBack()}
      />

      <FlatList
        data={historyEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderEvent}
        contentContainerStyle={{ paddingBottom: verticalScale(80) }}
      />
    </BaseContainer>
  );
};

export default EventHistoryScreen;

const styles = StyleSheet.create({
  eventCard: {
    flexDirection: 'row',
    marginHorizontal: scale(16),
    marginTop: verticalScale(12),
    padding: scale(12),
    borderRadius: moderateScale(14),
    backgroundColor: AppColors.card,
    borderWidth: 1,
    borderColor: AppColors.border,
  },

  eventImage: {
    width: moderateScale(72),
    height: moderateScale(72),
    borderRadius: moderateScale(10),
    marginRight: scale(10),
  },

  eventHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: scale(8),
  },

  eventTitle: {
    flex: 1,
    marginRight: scale(8),
  },

  badge: {
    backgroundColor: '#E5E5E5',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(8),
    alignSelf: 'flex-start',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(6),
  },
});
