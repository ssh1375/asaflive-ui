// GiveAllRoles.tsx
import React from 'react'
import DynamicTable from './DynamicTable';
import getNestedValue from '../../hooks/pubFunc/getNestedValue';

type CustomRenderersType = Record<string, (val: any, row: any) => React.ReactNode>;

interface GiveAllRolesProps {
  refreshFlag: boolean;
}

function GiveAllRoles({ refreshFlag }: GiveAllRolesProps) {

  const columns = [
    { header: "عنوان نقش", accessor: "name" },
    { header: "توضیحات", accessor: "description" },
    { header: "دسترسی ها", accessor: "permissions"  },
  ];

  const customRenderers: CustomRenderersType = {
    permissions: (value) => {
      if (!Array.isArray(value) || value.length === 0) {
        return <span className="text-gray-400 text-xs">بدون دسترسی</span>;
      }

      const visible = value.slice(0, 3);
      const hiddenCount = value.length - visible.length;

      return (
        <div className="flex flex-wrap gap-1 max-w-[280px]">
          {visible.map((perm: any) => {
            const name = typeof perm === "string" ? perm : perm.name;

            return (
              <span
                key={name}
                className="px-2 py-1 text-xs rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20"
              >
                {name}
              </span>
            );
          })}

          {hiddenCount > 0 && (
            <span className="px-2 py-1 text-xs rounded-md bg-gray-700 text-gray-300">
              +{hiddenCount} more
            </span>
          )}
        </div>
      );
    },
  };

  return (
    <div className='container'>
      <DynamicTable
        apiEndpoint="/rbac/roles"
        columns={columns}
        refreshFlag={refreshFlag}
        recordsPerPage={10}
        customRender={(row, colIndex) => {
          const col = columns[colIndex];
          if (col && customRenderers[col.accessor]) {
            return customRenderers[col.accessor](row[col.accessor], row);
          } else {
            const value = getNestedValue(row, col.accessor);
            return value || '-';
          }
        }}
      />
    </div>
  );
}

export default GiveAllRoles;
