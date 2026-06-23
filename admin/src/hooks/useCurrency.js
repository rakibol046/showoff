import { useGetSettingsQuery } from "@/features/settings/settingsApi";

export default function useCurrency() {
  const { data } = useGetSettingsQuery();
  return data?.currencySymbol ?? "$";
}
