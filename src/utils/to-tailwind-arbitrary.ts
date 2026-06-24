export const toTailwindArbitrary = (rawValue: string): string => {
  if (!rawValue) return "";

  return (
    rawValue
      .trim()
      // 1. Clean up unnecessary spaces around operators (, / ( ) [ ])
      .replaceAll(/\s*([,()/[\]])\s*/g, "$1")
      // 2. Clean up ALL remaining spaces with underscores
      // e.g. "Hello world!" => "Hello_world!"
      .replaceAll(/\s+/g, "_")
  );
};
