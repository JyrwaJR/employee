import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Button,
  Text,
  Skeleton,
  Input,
  FieldInput,
  Alert,
  AlertTitle,
  AlertDescription,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/src/shared/components/ui';
import { KeyboardSafeView, HeaderStack } from '@/src/shared/components/layout';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner-native';
import { useThemeStore } from '@/src/shared/store/theme.store';

export default function UILabScreen() {
  const [showDialog, setShowDialog] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { theme, setTheme, toggleTheme } = useThemeStore();
  const methods = useForm({
    defaultValues: {
      test_input: '',
      test_field: '',
    },
  });

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View className="mb-10">
      <Text
        variant="heading"
        size="xl"
        weight="bold"
        className="mb-6 text-blue-600 dark:text-blue-400">
        {title}
      </Text>
      <View className="gap-y-4">{children}</View>
    </View>
  );

  return (
    <KeyboardSafeView className="bg-slate-50 dark:bg-slate-900">
      <HeaderStack
        title="🛠 UI Laboratory"
        subtitle="Shared Component Catalog"
        rightIcon={
          <TouchableOpacity onPress={toggleTheme} className="p-2">
            <Ionicons
              name={theme === 'dark' ? 'sunny' : 'moon'}
              size={22}
              color={theme === 'dark' ? '#FBBF24' : '#1e293b'}
            />
          </TouchableOpacity>
        }
      />

      <ScrollView className="px-6 py-8" showsVerticalScrollIndicator={false}>
        {/* Theme Section */}
        <Section title="Theme Management">
          <View className="flex-row gap-x-2">
            <Button
              title="Light"
              variant={theme === 'light' ? 'primary' : 'outline'}
              className="flex-1"
              onPress={() => setTheme('light')}
            />
            <Button
              title="Dark"
              variant={theme === 'dark' ? 'primary' : 'outline'}
              className="flex-1"
              onPress={() => setTheme('dark')}
            />
            <Button
              title="System"
              variant={theme === 'system' ? 'primary' : 'outline'}
              className="flex-1"
              onPress={() => setTheme('system')}
            />
          </View>
        </Section>

        {/* Typography Section */}
        <Section title="Typography">
          <Text variant="heading" size="3xl">
            Heading 3XL
          </Text>
          <Text variant="heading" size="xl">
            Heading XL
          </Text>
          <Text weight="semibold">Body Semibold</Text>
          <Text variant="subtext">Subtext / Captions</Text>
          <Text variant="error">Error Message Text</Text>
          <Text variant="link">Interactive Link Text</Text>
        </Section>

        {/* Alerts Section */}
        <Section title="Alerts (Inline Feedback)">
          <Alert icon={<Ionicons name="information-circle" size={24} color="#3b82f6" />}>
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>Your profile has been updated successfully.</AlertDescription>
          </Alert>

          <Alert
            variant="destructive"
            icon={<Ionicons name="alert-circle" size={24} color="#ef4444" />}>
            <AlertTitle>Error Warning</AlertTitle>
            <AlertDescription>
              We were unable to save your changes. Please try again.
            </AlertDescription>
          </Alert>
        </Section>

        {/* Buttons Section */}
        <Section title="Buttons">
          <Button title="Primary Button" onPress={() => {}} />
          <Button title="Secondary Button" variant="secondary" onPress={() => {}} />
          <Button title="Outline Button" variant="outline" onPress={() => {}} />
          <Button title="Destructive Action" variant="destructive" onPress={() => {}} />
          <Button title="Loading State" isLoading onPress={() => {}} />
          <Button title="Ghost Button" variant="ghost" onPress={() => {}} />
          <Button title="Google Button" variant="google" onPress={() => {}} />
        </Section>

        {/* Inputs Section */}
        <Section title="Inputs">
          <Input placeholder="Standard Input" />
          <Input placeholder="Error State" error />

          <FormProvider {...methods}>
            <FieldInput
              name="test_field"
              label="Controlled Field"
              placeholder="Type here..."
              description="This uses React Hook Form context."
            />
          </FormProvider>
        </Section>

        {/* Loading / Skeleton Section */}
        <Section title="Skeleton Pulse">
          <View className="flex-row items-center gap-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <View className="flex-1 gap-y-2">
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
            </View>
          </View>
          <Skeleton className="h-32 w-full rounded-2xl" />
        </Section>

        {/* Overlays Section */}
        <Section title="Overlays & Notifications">
          <View className="flex-row flex-wrap gap-2">
            <Button
              title="Success Toast"
              variant="outline"
              className="flex-1"
              onPress={() =>
                toast.success('Profile updated', { description: 'Your changes have been saved.' })
              }
            />
            <Button
              title="Error Toast"
              variant="outline"
              className="flex-1"
              onPress={() =>
                toast.error('Save failed', { description: 'Please check your connection.' })
              }
            />
          </View>
          <View className="flex-row flex-wrap gap-2">
            <Button
              title="Info Toast"
              variant="outline"
              className="flex-1"
              onPress={() =>
                toast.info('New Update', { description: 'A new version is available.' })
              }
            />
            <Button
              title="Normal Toast"
              variant="outline"
              className="flex-1"
              onPress={() => toast('Simple message')}
            />
          </View>

          <View className="h-4" />

          <Button
            title="Open General Dialog"
            variant="secondary"
            onPress={() => setShowDialog(true)}
          />
          <Button
            title="Open Alert Dialog"
            variant="secondary"
            onPress={() => setShowAlert(true)}
          />
        </Section>

        <View className="h-20" />
      </ScrollView>

      {/* Dialog Demo */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent onClose={() => setShowDialog(false)}>
          <DialogHeader>
            <DialogTitle>Project Settings</DialogTitle>
            <DialogDescription>
              Manage your project preferences and team access here.
            </DialogDescription>
          </DialogHeader>
          <View className="h-20 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
            <Text variant="subtext">Custom Content Area</Text>
          </View>
          <DialogFooter>
            <Button title="Close" variant="ghost" onPress={() => setShowDialog(false)} />
            <Button title="Save Changes" onPress={() => setShowDialog(false)} />
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog Demo */}
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove your account from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onPress={() => setShowAlert(false)} />
            <AlertDialogAction
              variant="destructive"
              title="Yes, Delete"
              onPress={() => setShowAlert(false)}
            />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </KeyboardSafeView>
  );
}
