import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import NoteEditorScreen from '../screens/NoteEditorScreen';

export type RootStackParamList = {
  Home: undefined;
  // noteId kept for existing flows; imageUri removed — app creates the note first and navigates with noteId
  NoteEditor: { noteId?: string } | undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigation = () => {
  return (
    <NavigationContainer>
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
