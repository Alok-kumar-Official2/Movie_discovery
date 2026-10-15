/** Presents a selected YouTube trailer in a dismissible React Native modal. */
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { colors, spacing, typography } from '../../../theme';

interface TrailerModalProps {
  videoId: string | null;
  onClose: () => void;
}

export function TrailerModal({ videoId, onClose }: TrailerModalProps) {
  const { width } = useWindowDimensions();
  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={Boolean(videoId)}
    >
      <View style={styles.overlay}>
        <View style={styles.playerContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Movie Trailer</Text>
            <Pressable
              accessibilityLabel="Close trailer"
              accessibilityRole="button"
              onPress={onClose}
              hitSlop={12}
            >
              <Text style={styles.close}>Close</Text>
            </Pressable>
          </View>
          {videoId ? (
            <YoutubePlayer
              height={(width - spacing.lg * 2) * (9 / 16)}
              play
              videoId={videoId}
              webViewProps={{ allowsInlineMediaPlayback: true }}
            />
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.md,
    backgroundColor: colors.overlay,
  },
  playerContainer: {
    padding: spacing.md,
    borderRadius: spacing.radiusMedium,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.subtitle,
    fontWeight: typography.fontWeight.semibold,
  },
  close: {
    color: colors.accent,
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.semibold,
  },
});
