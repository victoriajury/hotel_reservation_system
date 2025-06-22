import * as React from 'react';

import Tab, { tabClasses } from '@mui/joy/Tab';
import TabList from '@mui/joy/TabList';
import Tabs from '@mui/joy/Tabs';

interface PageSectionProps {
  sections: {
    label: string;
    desc: string;
    ref: React.RefObject<HTMLDivElement | null>;
    showOnNewPage: boolean;
  }[];
  isEditMode: boolean;
}

export default function PageSectionTabs({ sections, isEditMode }: PageSectionProps) {

  const [tabIndex, setTabIndex] = React.useState(0);
  const handleTabChange = (
    _event: React.SyntheticEvent<Element, Event> | null,
    newValue: string | number | null
  ) => {
    if (newValue === null) return;
    const index = typeof newValue === 'number' ? newValue : Number(newValue);
    setTabIndex(index);
    const section = sections[index];

    if (section?.ref.current) {
      section.ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Tabs value={tabIndex} defaultValue={undefined} onChange={handleTabChange} sx={{ bgcolor: 'transparent' }}>
      <TabList
        tabFlex={1}
        size="sm"
        sx={{
          pl: { xs: 0, md: 4 },
          justifyContent: 'left',
          [`&& .${tabClasses.root}`]: {
            fontWeight: '600',
            flex: 'initial',
            color: 'text.tertiary',
            [`&.${tabClasses.selected}`]: {
              bgcolor: 'transparent',
              color: 'text.primary',
              '&::after': {
                height: '2px',
                bgcolor: 'primary.500',
              },
            },
          },
        }}
      >
        {sections.map((section) =>
          !isEditMode && !section.showOnNewPage
            ? ""
            : <Tab sx={{ borderRadius: '6px 6px 0 0' }} key={section.label}>{section.label}</Tab>
        )}
      </TabList>
    </Tabs>
  );
}
