export const calculateProfileCompletion = (userType: 'jobseeker' | 'employer' | null, userMetadata: any): number => {
  if (!userType || !userMetadata) return 0;

  let completedFields = 0;
  let totalFields = 0;

  const isFieldFilled = (value: any, isArray: boolean = false, isBoolean: boolean = false, isObjectArray: boolean = false): boolean => {
    if (value === undefined || value === null) return false;
    if (isBoolean) return value === true;
    if (isObjectArray) {
      return Array.isArray(value) && value.length > 0 && value.some((item: any) => {
        if (typeof item === 'object' && item !== null) {
          if (item.title || item.company) return true;
          if (item.degree || item.school) return true;
        }
        return false;
      });
    }
    if (isArray) return Array.isArray(value) && value.length > 0;
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        return trimmed.length > 10;
      }
      return trimmed.length > 0;
    }
    return !!value;
  };

  type FieldDefinition = {
    key: string;
    weight: number;
    isArray?: boolean;
    isBoolean?: boolean;
    isObjectArray?: boolean;
  };

  if (userType === 'jobseeker') {
    const requiredFields: FieldDefinition[] = [
      { key: 'first_name', weight: 8 },
      { key: 'last_name', weight: 8 },
      { key: 'title', weight: 9 },
    ];
    const essentialFields: FieldDefinition[] = [
      { key: 'bio', weight: 15 },
      { key: 'skills', weight: 15, isArray: true },
      { key: 'experience', weight: 10, isObjectArray: true },
      { key: 'education', weight: 10, isObjectArray: true },
    ];
    const additionalFields: FieldDefinition[] = [
      { key: 'location', weight: 8 },
      { key: 'phone', weight: 7 },
    ];
    const optionalFields: FieldDefinition[] = [
      { key: 'linkedin_url', weight: 5 },
      { key: 'portfolio_url', weight: 5 },
    ];

    requiredFields.forEach(field => {
      totalFields += field.weight;
      if (isFieldFilled(userMetadata[field.key])) completedFields += field.weight;
    });
    essentialFields.forEach(field => {
      totalFields += field.weight;
      if (isFieldFilled(userMetadata[field.key], field.isArray, field.isBoolean, field.isObjectArray)) {
        completedFields += field.weight;
      }
    });
    additionalFields.forEach(field => {
      totalFields += field.weight;
      if (isFieldFilled(userMetadata[field.key], field.isArray, field.isBoolean, field.isObjectArray)) {
        completedFields += field.weight;
      }
    });
    optionalFields.forEach(field => {
      totalFields += field.weight;
      if (isFieldFilled(userMetadata[field.key], field.isArray, field.isBoolean, field.isObjectArray)) {
        completedFields += field.weight;
      }
    });
  } else if (userType === 'employer') {
    const requiredFields: FieldDefinition[] = [{ key: 'company_name', weight: 30 }];
    const importantFields: FieldDefinition[] = [
      { key: 'industry', weight: 20 },
      { key: 'company_description', weight: 20 },
      { key: 'location', weight: 10 },
    ];
    const optionalFields: FieldDefinition[] = [
      { key: 'company_website', weight: 10 },
      { key: 'company_size', weight: 5 },
      { key: 'phone', weight: 5 },
    ];

    requiredFields.forEach(field => {
      totalFields += field.weight;
      if (isFieldFilled(userMetadata[field.key])) completedFields += field.weight;
    });
    importantFields.forEach(field => {
      totalFields += field.weight;
      if (isFieldFilled(userMetadata[field.key])) completedFields += field.weight;
    });
    optionalFields.forEach(field => {
      totalFields += field.weight;
      if (isFieldFilled(userMetadata[field.key])) completedFields += field.weight;
    });
  }

  if (totalFields === 0) return 0;
  const percentage = Math.round((completedFields / totalFields) * 100);
  return Math.min(100, Math.max(0, percentage));
};


