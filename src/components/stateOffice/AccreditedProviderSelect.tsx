import * as React from "react";
import { SearchSelect, type SearchSelectOption } from "@/components/ui/search-select";
import { stateOfficeAccreditedProvidersApi } from "@/lib/api";

interface Props {
  type: "hmo" | "hcp";
  stateId?: string;
  value?: string;
  onChange: (provider: { id: string; name: string; code: string } | null) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function AccreditedProviderSelect({
  type, stateId, value, onChange, disabled, placeholder,
}: Props) {
  const [options, setOptions] = React.useState<SearchSelectOption[]>([]);
  const [loading, setLoading] = React.useState(false);
  const cacheRef = React.useRef<Map<string, SearchSelectOption>>(new Map());
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevStateId = React.useRef<string | undefined>(stateId);
  const needsState = type === "hcp";

  const load = React.useCallback(async (q?: string) => {
    if (needsState && !stateId) {
      setOptions([]);
      return;
    }
    setLoading(true);
    try {
      const res = await stateOfficeAccreditedProvidersApi.list({
        type,
        ...(needsState && stateId ? { state_id: stateId } : {}),
        q: q?.trim() || undefined,
        limit: type === "hmo" ? "100" : "50",
      });
      const opts = res.data.map((p: any) => {
        const o = { value: String(p.id), label: p.name, sub: p.provider_code };
        cacheRef.current.set(o.value, o);
        return o;
      });
      setOptions(opts);
    } catch {
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, [type, stateId, needsState]);

  React.useEffect(() => {
    if (needsState && prevStateId.current !== stateId) {
      if (prevStateId.current !== undefined) onChange(null);
      prevStateId.current = stateId;
    }
    if (!needsState) prevStateId.current = stateId;
    cacheRef.current.clear();
    load();
  }, [type, stateId, load, onChange, needsState]);

  const handleSearch = React.useCallback((q: string) => {
    if (type !== "hcp") return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.trim().length < 2) {
      if (!q.trim()) load();
      return;
    }
    debounceRef.current = setTimeout(() => load(q), 300);
  }, [type, load]);

  const handleChange = (id: string) => {
    if (!id) {
      onChange(null);
      return;
    }
    const opt = cacheRef.current.get(id) ?? options.find((o) => o.value === id);
    onChange({
      id,
      name: opt?.label ?? "",
      code: opt?.sub ?? "",
    });
  };

  const blocked = disabled || (needsState && !stateId);

  return (
    <SearchSelect
      options={options}
      value={value}
      onChange={handleChange}
      disabled={blocked || loading}
      placeholder={
        needsState && !stateId
          ? "Select state first"
          : loading
            ? "Loading NHIA list..."
            : (placeholder ?? `Select accredited ${type.toUpperCase()}`)
      }
      searchPlaceholder={
        type === "hmo"
          ? "Search accredited HMOs (nationwide)..."
          : "Search HCPs in selected state..."
      }
      clearable
      onSearchChange={type === "hcp" ? handleSearch : undefined}
    />
  );
}
