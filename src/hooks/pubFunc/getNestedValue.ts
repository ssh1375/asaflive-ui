const getNestedValue = (row: any, accessor: string): any => {
  try {
    return accessor.split('.').reduce((acc, key) => {
      if (acc === null || acc === undefined) return undefined;
      return acc[key];
    }, row);
  } catch {
    return undefined;
  }
};

export default getNestedValue;