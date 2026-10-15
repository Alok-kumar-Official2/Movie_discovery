/** Applies the app's disk-and-memory cache policy consistently to Expo images. */
import { memo } from 'react';
import { Image, type ImageProps } from 'expo-image';

function CachedImageComponent(props: ImageProps) {
  return <Image {...props} cachePolicy={props.cachePolicy ?? 'memory-disk'} />;
}

export const CachedImage = memo(CachedImageComponent);
