/** Exposes a single offline flag to banners and other connectivity-aware UI. */
import { useNetInfo } from '@react-native-community/netinfo';

export function useNetworkStatus(): boolean {
  const { isConnected, isInternetReachable } = useNetInfo();
  return isConnected === false || isInternetReachable === false;
}
