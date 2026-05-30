// App.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/store';
import { injectStore } from './src/services/api';
import { RootNavigator } from './src/navigation/RootNavigator';

// Inject the store into the API module at runtime to avoid circular dependency
injectStore(store);

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}
