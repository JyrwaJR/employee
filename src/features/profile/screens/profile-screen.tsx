import React from 'react';
import { View, ScrollView } from 'react-native';
import { Container } from '@components/layout/container';
import { useAuthStore } from '@stores/auth.store';
import { Text } from '@components/ui/text';
import { SettingRow } from '@components/common/setting-row';
import { ProfileDetailRow } from '../components/profile-detail-row';
import { ConfirmLogoutAlert } from '../components';
import { useProfileSections } from '../hooks/use-profile-sections';
import { Card, CardHeader, CardContent } from '@components/ui/card';
import { GovtHeader } from '@components/common/govt-header';

export const ProfileScreen = () => {
  const { user, emp_cd } = useAuthStore();
  const [showLogoutAlert, setShowLogoutAlert] = React.useState(false);
  const profileSections = useProfileSections(user);

  return (
    <Container>
      {/* Identity Header — Govt branding */}
      <View className="border-b border-border bg-background pb-4 pt-4">
        <GovtHeader
          title={user ? `${user.emp_fname} ${user.emp_lname}` : 'Loading...'}
          subtitle={user ? `Current DDO: ${user.ddo_code} - ${user.ddo_name}` : undefined}
          badge={emp_cd ? `Employee Code: ${emp_cd}` : undefined}
        />

        {/* Employee code inline when no badge */}
        {!emp_cd && (
          <Text variant="subtext" size="xs" className="text-center text-graphite">
            Employee Code: —
          </Text>
        )}
      </View>

      <ScrollView className="flex-1 pt-6" showsVerticalScrollIndicator={false}>
        {/* Profile sections rendered as NIC portal-style cards */}
        {profileSections.map((section) => (
          <Card key={section.title} variant="bordered" className="mb-4 overflow-hidden">
            {/* Section header */}
            <CardHeader className="bg-surface-soft px-4 py-2.5">
              <Text className="text-xs font-bold uppercase tracking-wider text-graphite">
                {section.title}
              </Text>
            </CardHeader>

            {/* Two-column table rows */}
            <CardContent className="p-0">
              {section.fields.map((field) => (
                <ProfileDetailRow
                  key={field.label}
                  label={field.label}
                  value={field.value || '-'}
                />
              ))}
            </CardContent>
          </Card>
        ))}

        {/* Settings */}
        <View className="mb-10">
          <Text
            variant="subtext"
            size="xs"
            className="mb-2 font-bold uppercase tracking-wider text-graphite">
            Preferences & Account
          </Text>
          <Card variant="bordered" className="px-2">
            <SettingRow icon="lock-closed-outline" label="Change Password" onPress={() => {}} />
            <SettingRow icon="document-text-outline" label="Service Record" onPress={() => {}} />
            <SettingRow
              icon="log-out-outline"
              label="Log Out"
              isDestructive
              onPress={() => setShowLogoutAlert(!showLogoutAlert)}
              showBorder={false}
            />
          </Card>
        </View>

        {/* Footer */}
        <View className="items-center pb-8 opacity-60">
          <Text variant="subtext" size="xs" className="text-graphite">
            NIC e-HRMS v2.0 • Government of India
          </Text>
        </View>
        <ConfirmLogoutAlert open={showLogoutAlert} onValueChange={setShowLogoutAlert} />
      </ScrollView>
    </Container>
  );
};
