declare module 'react-native' {
  import React from 'react';
  
  export interface ViewStyle {
    [key: string]: any;
  }
  export interface TextStyle {
    [key: string]: any;
  }
  export interface ImageStyle {
    [key: string]: any;
  }
  
  type StyleProp<T> = T | T[] | null | undefined;
  
  export const View: React.FC<any>;
  export const Text: React.FC<any>;
  export const TextInput: React.FC<any> & { prototype: any };
  export const TouchableOpacity: React.FC<any>;
  export const FlatList: React.FC<any>;
  export const ScrollView: React.FC<any>;
  export const Image: React.FC<any>;
  export const SafeAreaView: React.FC<any>;
  export const ActivityIndicator: React.FC<any>;
  export const RefreshControl: React.FC<any>;
  export const Alert: { alert: (title: string, message?: string) => void };
  export const KeyboardAvoidingView: React.FC<any>;
  export const Linking: { openURL: (url: string) => Promise<void> };
  export const Platform: { OS: string; select: (obj: any) => any };
  export const Share: { share: (content: any, options?: any) => Promise<any> };
  
  export const StyleSheet: {
    create: <T extends Record<string, ViewStyle | TextStyle | ImageStyle>>(styles: T) => T;
  };
}
