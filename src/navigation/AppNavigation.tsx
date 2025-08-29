import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import NoteEditorScreen from '../screens/NoteEditorScreen';
import { ShareHandler } from '../components/ShareHandler';

export type RootStackParamList = {
  Home: undefined;
  // noteId kept for existing flows; added sharedImages and isSharedContent for share functionality
  NoteEditor: {
    noteId?: string;
    sharedImages?: string[];
    isSharedContent?: boolean;
  } | undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <ShareHandler />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }} >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="NoteEditor" component={NoteEditorScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
