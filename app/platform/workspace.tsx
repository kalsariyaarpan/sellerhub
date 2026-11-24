import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, BackHandler, Linking, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink, RotateCw } from 'lucide-react-native';
import { WebView, type WebViewNavigation } from 'react-native-webview';
import { Button, Label, Mark, purple, usePalette } from '../../components/ui';
import { platforms, type Platform } from '../../constants/platforms';
import { usePlatforms } from '../../hooks/usePlatforms';

export default function Workspace() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { selected } = usePlatforms();
  const platform = platforms.find(item => item.id === id && selected.includes(item.id));
  return platform ? <Portal key={platform.id} platform={platform} />
    : <SafeAreaView style={styles.error}><Label>Choose an added platform to open its workspace.</Label>
      <Button text="My Platforms" onPress={() => router.replace('/platforms')} /></SafeAreaView>;
}

function Portal({ platform }: { platform: Platform }) {
  const c = usePalette();
  const web = useRef<WebView>(null);
  const { recordOpen } = usePlatforms();
  const recorded = useRef(false);
  const [navigation, setNavigation] = useState<WebViewNavigation>();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [popupUrl, setPopupUrl] = useState<string>(platform.url);

  useEffect(() => {
    if (!recorded.current) {
      recorded.current = true;
      recordOpen(platform.id);
    }
  }, [platform.id, recordOpen]);

  useFocusEffect(useCallback(() => {
    const back = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!navigation?.canGoBack || error) return false;
      web.current?.goBack();
      return true;
    });
    return () => back.remove();
  }, [navigation?.canGoBack, error]));

  function openBrowser() {
    const url = navigation?.url;
    void Linking.openURL(url?.startsWith('https://') ? url : platform.url)
      .catch(() => Alert.alert('Browser unavailable', 'The seller portal could not be opened in your browser.'));
  }

  function refresh() {
    if (error) {
      const current = navigation?.url;
      setPopupUrl(current?.startsWith('https://') ? current : platform.url);
      setNavigation(undefined);
      setError('');
      setProgress(0);
      setRetry(value => value + 1);
    } else web.current?.reload();
  }

  const action = (title: string, Icon: typeof ArrowLeft, handler: () => void, disabled = false) =>
    <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={handler} disabled={disabled}
      style={[styles.action, { opacity: disabled ? 0.35 : 1 }]}><Icon size={19} color={c.ink} /></Pressable>;

  return <SafeAreaView style={[styles.container, { backgroundColor: c.bg }]}>
    <View style={[styles.header, { borderBottomColor: c.line }]}>
      {action('Close workspace', ArrowLeft, () => router.canGoBack() ? router.back() : router.replace('/platforms'))}
      <Mark platform={platform} />
      <View style={{ flex: 1 }}><Label size={14}>{platform.name}</Label></View>
      {action('Previous page', ChevronLeft, () => web.current?.goBack(), !navigation?.canGoBack || !!error)}
      {action('Next page', ChevronRight, () => web.current?.goForward(), !navigation?.canGoForward || !!error)}
      {action('Refresh seller portal', RotateCw, refresh)}
      {action('Open in browser', ExternalLink, openBrowser)}
    </View>
    {progress < 1 && !error && <View accessibilityLabel="Loading seller portal" style={{ height: 3, backgroundColor: c.panel }}>
      <View style={{ height: 3, width: `${Math.max(progress * 100, 3)}%`, backgroundColor: purple }} />
    </View>}
    {error ? <View style={styles.error}>
      <Label size={22}>Could not open {platform.name}</Label>
      <Label muted>{error}</Label>
      <Button text="Try again" onPress={refresh} />
      <Button text="Open in browser" secondary onPress={openBrowser} />
    </View> : <WebView key={retry} ref={web} style={styles.container} source={{ uri: popupUrl }}
      originWhitelist={['*']} javaScriptEnabled domStorageEnabled sharedCookiesEnabled thirdPartyCookiesEnabled
      mixedContentMode="never" allowFileAccess={false}
      onShouldStartLoadWithRequest={({ url }) => url.startsWith('https://') || url === 'about:blank'}
      onNavigationStateChange={setNavigation} onLoadStart={() => setProgress(0)}
      onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
      onOpenWindow={({ nativeEvent }) => {
        if (nativeEvent.targetUrl.startsWith('https://')) setPopupUrl(nativeEvent.targetUrl);
      }}
      onError={({ nativeEvent }) => setError(nativeEvent.description || 'Check your internet connection and try again.')}
      onHttpError={({ nativeEvent }) => {
        if (nativeEvent.url === navigation?.url || nativeEvent.url === popupUrl) {
          setError(nativeEvent.statusCode === 403
            ? 'The seller portal denied access. It may restrict embedded browsers.'
            : `The seller portal returned HTTP ${nativeEvent.statusCode}.`);
        }
      }}
      onRenderProcessGone={() => setError('The Android WebView closed. Try loading the seller portal again.')}
    />}
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 4, minHeight: 56, gap: 3, borderBottomWidth: StyleSheet.hairlineWidth },
  action: { width: 39, height: 48, justifyContent: 'center', alignItems: 'center' },
  error: { flex: 1, padding: 24, justifyContent: 'center', gap: 14 },
});
