// src/navigation/RootNavigator.tsx
import React from 'react';
import { useAppSelector } from '../store';
import { selectIsAuthenticated, selectIsGuest } from '../store/slices/authSlice';
import { AuthStack } from './AuthStack';
import { MainTabs } from './MainTabs';

export const RootNavigator = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isGuest = useAppSelector(selectIsGuest);

  if (isAuthenticated || isGuest) {
    return <MainTabs />;
  }

  return <AuthStack />;
};
