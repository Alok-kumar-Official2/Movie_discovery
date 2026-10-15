/** Backdrop preview strip with a direct link to the full-screen image viewer. */
import { useCallback } from 'react';
import { FlatList, ListRenderItem, Pressable, StyleSheet } from 'react-native';
import { CachedImage as Image } from '../../common/CachedImage';
import type { MovieBackdrop, MovieImagesResponse } from '../../../api/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/types';
import { DetailSection } from './DetailSection';
import { colors, spacing } from '../../../theme';
import { imageUrl } from '../../../utils/formatters';

interface GalleryStripProps {
  movieId: number;
  images?: MovieImagesResponse;
  isLoading: boolean;
  errorMessage?: string;
  onRetry: () => void;
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

export function GalleryStrip({
  movieId,
  images,
  isLoading,
  errorMessage,
  onRetry,
  navigation,
}: GalleryStripProps) {
  const backdrops = images?.backdrops.slice(0, 12) ?? [];
  const renderBackdrop = useCallback<ListRenderItem<MovieBackdrop>>(
    ({ item, index }) => (
      <Pressable
        accessibilityLabel={`Open movie image ${index + 1}`}
        accessibilityRole="button"
        onPress={() => navigation.navigate('Gallery', { movieId, initialIndex: index })}
      >
        <Image
          accessibilityLabel={`Movie backdrop ${index + 1}`}
          contentFit="cover"
          source={{ uri: imageUrl(item.file_path, 'w300') }}
          style={styles.image}
        />
      </Pressable>
    ),
    [movieId, navigation],
  );

  return (
    <DetailSection
      title="Photos"
      isLoading={isLoading}
      errorMessage={errorMessage}
      onRetry={onRetry}
      hasData={Boolean(images)}
      isEmpty={!backdrops.length}
      emptyMessage="No gallery images are available."
    >
      <FlatList
        contentContainerStyle={styles.list}
        data={backdrops}
        horizontal
        initialNumToRender={3}
        keyExtractor={(image) => image.file_path}
        maxToRenderPerBatch={3}
        renderItem={renderBackdrop}
        showsHorizontalScrollIndicator={false}
        windowSize={3}
      />
    </DetailSection>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingLeft: spacing.screenHorizontal,
  },
  image: {
    width: 200,
    height: 118,
    marginRight: spacing.sm,
    borderRadius: spacing.radiusMedium,
    backgroundColor: colors.surfaceElevated,
  },
});
