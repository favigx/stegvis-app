import type { EnumButtonOption } from "../types/props/props"; 

export function useFilterOptions(
  options: EnumButtonOption[],
  search: string,
  searchable: boolean
): EnumButtonOption[] {
  if (!searchable) return options;

  const lowerSearch = search.toLowerCase();

  return options.filter(
    opt =>
      opt.name.toLowerCase().startsWith(lowerSearch) ||
      opt.code.toLowerCase().startsWith(lowerSearch)
  );
}
