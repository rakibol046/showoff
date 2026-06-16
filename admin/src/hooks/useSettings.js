import { useGetSettingsQuery } from "@/features/settings/settingsApi";

export default function useSettings() {
  const { data } = useGetSettingsQuery();
  return {
    symbol: data?.currencySymbol ?? "$",
    currency: data?.currency ?? "USD",
    storeName: data?.storeName ?? "Showoff",
    storeEmail: data?.storeEmail ?? "",
    storeAddress: data?.storeAddress ?? "",
  };
}
