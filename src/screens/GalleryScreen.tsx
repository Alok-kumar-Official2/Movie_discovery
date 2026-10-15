/** Full-screen swipeable backdrop viewer for a movie's TMDB image gallery. */
import { useCallback } from 'react';
import {
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CachedImage as Image } from '../components/common/CachedImage';
import { GalleryCloseButton } from '../components/movie/GalleryCloseButton';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorView } from '../components/common/ErrorView';
import { Loader } from '../components/common/Loader';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { OfflineBanner } from '../components/common/OfflineBanner';
import type { MovieBackdrop } from '../api/types';
import { useMovieImages } from '../hooks/useMovieDetails';
import type { RootStackScreenProps } from '../navigation/types';
import { colors, spacing, typography } from '../theme';
import { getUserErrorMessage } from '../utils/errors';
import { imageUrl } from '../utils/formatters';

export function GalleryScreen({ route, navigation }: RootStackScreenProps<'Gallery'>) {
  const { movieId, initialIndex = 0 } = route.params;
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const imagesQuery = useMovieImages(movieId);
  const backdrops = imagesQuery.data?.backdrops ?? [];
  const startIndex = Math.min(initialIndex, Math.max(0, backdrops.length - 1));

  const renderBackdrop = useCallback<ListRenderItem<MovieBackdrop>>(
    ({ item, index }) => (
      <View style={[styles.page, { width, height }]}>
        <Image
          accessibilityLabel={`Movie gallery image ${index + 1}`}
          contentFit="contain"
          source={{ uri: imageUrl(item.file_path, 'original') }}
          style={{ width, height }}
        />
      </View>
    ),
    [height, width],
  );

  if (imagesQuery.isLoading) {
    return (
      <ScreenContainer style={styles.state}>
        <StatusBar hidden />
        <OfflineBanner />
        <Loader label="Loading gallery" />
        <GalleryCloseButton
          onPress={() => navigation.goBack()}
          top={insets.top + spacing.md}
        />
      </ScreenContainer>
    );
  }

  if (imagesQuery.error && !imagesQuery.data) {
    return (
      <ScreenContainer style={styles.state}>
        <StatusBar hidden />
        <OfflineBanner />
        <ErrorView
          message={getUserErrorMessage(
            imagesQuery.error,
            'Unable to load the gallery. Please try again.',
          )}
          onRetry={() => void imagesQuery.refetch()}
        />
        <GalleryCloseButton
          onPress={() => navigation.goBack()}
          top={insets.top + spacing.md}
        />
      </ScreenContainer>
    );
  }

  if (imagesQuery.error && backdrops.length === 0) {
    return (
      <ScreenContainer style={styles.state}>
        <StatusBar hidden />
        <OfflineBanner />
        <ErrorView
          message={getUserErrorMessage(
            imagesQuery.error,
            'Unable to refresh the gallery.',
          )}
          onRetry={() => void imagesQuery.refetch()}
        />
        <GalleryCloseButton
          onPress={() => navigation.goBack()}
          top={insets.top + spacing.md}
        />
      </ScreenContainer>
    );
  }

  if (backdrops.length === 0) {
    return (
      <ScreenContainer style={styles.state}>
        <StatusBar hidden />
        <OfflineBanner />
        <EmptyState title="No gallery images" />
        <GalleryCloseButton
          onPress={() => navigation.goBack()}
          top={insets.top + spacing.md}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={[]} style={styles.viewer}>
      <StatusBar hidden />
      <OfflineBanner />
      {imagesQuery.error ? (
        <View style={styles.refreshError} accessibilityRole="alert">
          <Text style={styles.refreshErrorText}>
            Unable to refresh gallery images. Showing saved images.
          </Text>
          <Pressable
            accessibilityLabel="Retry refreshing gallery images"
            accessibilityRole="button"
            onPress={() => void imagesQuery.refetch()}
          >
            <Text style={styles.refreshErrorAction}>Retry</Text>
          </Pressable>
        </View>
      ) : null}
      <FlatList
        data={backdrops}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        horizontal
        initialNumToRender={1}
        initialScrollIndex={startIndex}
        keyExtractor={(image) => image.file_path}
        maxToRenderPerBatch={2}
        pagingEnabled
        renderItem={renderBackdrop}
        showsHorizontalScrollIndicator={false}
        windowSize={3}
      />
      <GalleryCloseButton
        onPress={() => navigation.goBack()}
        top={insets.top + spacing.md}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  viewer: {
    backgroundColor: colors.background,
  },
  page: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  state: {
    justifyContent: 'center',
  },
  refreshError: {
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.surfaceElevated,
  },
  refreshErrorText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.caption,
  },
  refreshErrorAction: {
    color: colors.accent,
    fontSize: typography.fontSize.caption,
    fontWeight: typography.fontWeight.semibold,
  },
});
