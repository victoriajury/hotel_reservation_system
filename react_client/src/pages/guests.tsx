import * as React from 'react';

import { Crud } from '@toolpad/core/Crud';
import { guestsDataSource, Guest, guestsCache } from '../data/guests';
import { GridColDef } from '@mui/x-data-grid';


export default function GuestsCrudPage() {
  

  return (
    <Crud<Guest>
      dataSource={guestsDataSource}
      dataSourceCache={guestsCache}
      rootPath="/guests"
      initialPageSize={25}
      defaultValues={{ itemCount: 1, modified_by_id: 1 }}
      slotProps={{
        list: {
          dataGrid: {
            checkboxSelection: false, 
            columnVisibilityModel: {
              id: false,
              address_1: false,
              address_2: false,
              city: false,
              county: false,
              postcode: false,
              }
          }
        }
      }}
    />
  );
}
