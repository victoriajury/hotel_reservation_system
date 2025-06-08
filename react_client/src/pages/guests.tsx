import * as React from 'react';

import { Crud } from '@toolpad/core/Crud';
import { guestsDataSource, Guest, guestsCache } from '../data/guests';


export default function GuestsCrudPage() {
  

  return (
    <Crud<Guest>
      dataSource={guestsDataSource}
      dataSourceCache={guestsCache}
      rootPath="/guests"
      initialPageSize={25}
      defaultValues={{ itemCount: 1 }}
    />
  );
}
