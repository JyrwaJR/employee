import React from 'react';
import { HeaderStack } from '@/src/shared/components/layout/header';
import { AnnouncementBoardScreen } from '@/src/features/announcements';

export default function AnnouncementsRoute() {
  return (
    <>
      <HeaderStack title="Announcement Board" />
      <AnnouncementBoardScreen />
    </>
  );
}
