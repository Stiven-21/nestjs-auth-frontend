export const parsePermissions = (input: string | string[]): string[] => {
  if (!input) return [];
  if (Array.isArray(input)) return input.map((p) => p.trim()).filter(Boolean);

  let value = input.trim();

  if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
  if (value === "all") return ["all"];
  if (value.startsWith("{") && value.endsWith("}")) value = value.slice(1, -1);

  return value
    .split(",")
    .map((p) => p.trim())
    .map((p) => p.replace(/^"|"$/g, ""))
    .filter(Boolean);
};
