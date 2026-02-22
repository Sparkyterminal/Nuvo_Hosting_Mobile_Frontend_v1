import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import CustomText from './CustomText';
import { AppColors } from '../theme/colors';
import { Dimensions } from 'react-native';
import { scale } from 'react-native-size-matters';

interface Props {
  visible: boolean;
  title: string;
  content: string;
  onClose: () => void;
}
const SCREEN_HEIGHT = Dimensions.get('window').height;

const AppBottomSheet: React.FC<Props> = ({
  visible,
  title,
  content,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <CustomText
              weight="bold"
              variant="title"
              color={AppColors.textPrimary}
            >
              {title}
            </CustomText>

            <TouchableOpacity onPress={onClose}>
              <CustomText color={AppColors.primary}>Close</CustomText>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body}>
            <CustomText>{content}</CustomText>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: AppColors.overlay,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: AppColors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    minHeight: SCREEN_HEIGHT * 0.6,
    maxHeight: SCREEN_HEIGHT * 0.9,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(12),
  },
  body: {
    marginTop: scale(8),
  },
});

export default AppBottomSheet;
