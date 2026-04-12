import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
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
  AlertDialogAction,
  toast,
  SkeletonProvider,
  SkeletonItem,
  AnimationProvider,
  FadeInView,
  Image,
  AlertDialogFooter,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialog,
  AlertDialogCancel,
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/src/shared/components/ui';
import { KeyboardSafeView, HeaderStack } from '@/src/shared/components/layout';
import { FormProvider, useForm } from 'react-hook-form';
import { useThemeStore } from '@/src/shared/store/theme.store';

export default function UILabScreen() {
  const [showDialog, setShowDialog] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isSkeletonTrigger, setIsSkeletonTrigger] = useState(false);
  const [accordionValue, setAccordionValue] = useState('item-1');
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
    <>
      <KeyboardSafeView
        className="flex-1 bg-slate-50 dark:bg-slate-900"
        contentContainerClassName="px-6 py-8">
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

        {/* Theme Section */}
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

        {/* Accordion Section */}
        <Section title="Accordion (Collapsible Content)">
          <Accordion value={accordionValue} onValueChange={setAccordionValue}>
            <AccordionItem value="item-1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                <Text variant="subtext">
                  Yes. It adheres to the WAI-ARIA design pattern and supports keyboard navigation on
                  platforms where applicable.
                </Text>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it animated?</AccordionTrigger>
              <AccordionContent>
                <Text variant="subtext">
                  Yes. It uses native LayoutAnimations for the expansion and Reanimated for the
                  state-driven chevron rotation.
                </Text>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Section>

        {/* Cards Section */}
        <Section title="Cards (Shadcn Style)">
          <Card>
            <CardHeader>
              <CardTitle>Project Update</CardTitle>
              <CardDescription>Generated on April 12, 2026</CardDescription>
            </CardHeader>
            <CardContent>
              <Text>
                The primary UI infrastructure is now complete. We have implemented Shadcn-inspired
                patterns for layout, navigation, and animations.
              </Text>
              <View className="h-4" />
              <Image
                source={{ uri: 'https://picsum.photos/400/200' }}
                containerClassName="h-32 w-full rounded-2xl"
              />
            </CardContent>
            <CardFooter className="justify-end gap-x-2">
              <Button title="Cancel" variant="secondary" onPress={() => {}} />
              <Button title="Deploy" onPress={() => {}} />
            </CardFooter>
          </Card>
        </Section>

        {/* Buttons Section */}
        <Section title="Buttons">
          <Button title="Primary Button" onPress={() => {}} />
          <Button title="Secondary Button" variant="secondary" onPress={() => {}} />
          <Button title="Outline Button" variant="outline" onPress={() => {}} />
          <Button title="Destructive Action" variant="destructive" onPress={() => {}} />
          <Button title="Loading State" isLoading onPress={() => {}} />
          <Button title="Ghost Button" variant="ghost" onPress={() => {}} />
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

        {/* Contextual Skeleton Section */}
        <Section title="Contextual Skeleton (The Ghost Wrapper)">
          <Button
            title={isSkeletonTrigger ? 'Stop Loading' : 'Trigger Context Loading'}
            variant="secondary"
            onPress={() => setIsSkeletonTrigger(!isSkeletonTrigger)}
          />

          <SkeletonProvider isLoading={isSkeletonTrigger}>
            <View className="mt-4 flex-row items-center gap-x-4 rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-slate-900">
              <SkeletonItem className="rounded-full">
                <View className="h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  <Ionicons name="person" size={32} color="#3b82f6" />
                </View>
              </SkeletonItem>

              <View className="flex-1 gap-y-1">
                <SkeletonItem className="rounded-md">
                  <Text variant="heading" size="lg">
                    Alex Henderson
                  </Text>
                </SkeletonItem>
                <SkeletonItem className="rounded-md">
                  <Text variant="subtext" size="sm">
                    Senior Software Architect
                  </Text>
                </SkeletonItem>
              </View>
            </View>
          </SkeletonProvider>
        </Section>

        {/* Premium Image Section */}
        <Section title="Premium Image (Loading & Error States)">
          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text variant="subtext" className="mb-2">
                Successful Load
              </Text>
              <Image
                source={{ uri: 'https://picsum.photos/200/300' }}
                containerClassName="h-40 w-full rounded-2xl"
              />
            </View>

            <View className="flex-1">
              <Text variant="subtext" className="mb-2">
                Custom Fallback
              </Text>
              <Image
                source={{ uri: 'https://invalid-image-url.com/error.jpg' }}
                fallbackIcon="person-outline"
                containerClassName="h-40 w-full rounded-2xl"
              />
            </View>
          </View>
        </Section>

        {/* Entrance Animations Section */}
        <Section title="Entrance Animations (Automatic Stagger)">
          <AnimationProvider stagger={150}>
            <View className="rounded-3xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-slate-900">
              {[1, 2, 3].map((i) => (
                <FadeInView
                  key={i}
                  delay={i * 100}
                  translateY={30}
                  className="mb-4 rounded-2xl bg-slate-50 p-6 dark:bg-slate-800">
                  <View className="flex-row items-center gap-x-3">
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30">
                      <Ionicons name="flash" size={20} color="#3b82f6" />
                    </View>
                    <View className="flex-1">
                      <Text weight="bold">Item Sequence {i}</Text>
                      <Text variant="subtext" size="sm">
                        Automatically staggered entrance
                      </Text>
                    </View>
                  </View>
                </FadeInView>
              ))}
            </View>
          </AnimationProvider>
        </Section>

        <View className="h-20" />
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
          <View className="flex-row">
            <Button
              title="Long Description Toast"
              variant="outline"
              className="w-full"
              onPress={() =>
                toast.error('Long Error', {
                  description:
                    'This is a very long error message that should be truncated to prevent it from filling the entire screen and blocking other UI elements. It contains more than enough characters to trigger our safety caps. This is a very long error message that should be truncated to prevent it from filling the entire screen and blocking other UI elements.',
                })
              }
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
      </KeyboardSafeView>

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
    </>
  );
}
