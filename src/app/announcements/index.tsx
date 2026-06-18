import React from 'react';
import { HeaderStack } from '@components/layout/header';
import { AnnouncementBoardScreen } from '@features/announcements';

export default function AnnouncementsRoute() {
  return (
    <>
      <HeaderStack title="Announcement Board" />
      <AnnouncementBoardScreen />
    </>
  );
}
