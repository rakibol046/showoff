import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useGetSettingsQuery, useUpdateSettingsMutation } from "@/features/settings/settingsApi";
import PageHeader from "@/components/common/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

function Section({ title, children }) {
  return (
    <div className="border rounded-xl p-5 space-y-4">
      <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-1">{children}</div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default function Settings() {
  const { data: settings, isLoading } = useGetSettingsQuery();
  const [updateSettings, { isLoading: saving }] = useUpdateSettingsMutation();

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm({
    defaultValues: {
      storeName: "",
      storeEmail: "",
      storeAddress: "",
      currency: "",
      currencySymbol: "",
    },
  });

  useEffect(() => {
    if (settings) {
      reset({
        storeName: settings.storeName ?? "",
        storeEmail: settings.storeEmail ?? "",
        storeAddress: settings.storeAddress ?? "",
        currency: settings.currency ?? "",
        currencySymbol: settings.currencySymbol ?? "",
      });
    }
  }, [settings, reset]);

  const onSubmit = async (data) => {
    await updateSettings(data);
  };

  if (isLoading) {
    return (
      <div className="space-y-5 max-w-2xl">
        <Skeleton className="h-10 w-48" />
        <div className="border rounded-xl p-5 space-y-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
        </div>
        <div className="border rounded-xl p-5 space-y-4">
          {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Settings" subtitle="Manage store information and preferences" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Section title="Store Information">
          <Field label="Store Name *" error={errors.storeName?.message}>
            <Input
              placeholder="e.g. Showoff"
              {...register("storeName", { required: "Store name is required" })}
            />
          </Field>
          <Field label="Store Email" error={errors.storeEmail?.message}>
            <Input
              type="email"
              placeholder="store@example.com"
              {...register("storeEmail", {
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
              })}
            />
          </Field>
          <Field label="Store Address">
            <Input placeholder="City, Country" {...register("storeAddress")} />
          </Field>
        </Section>

        <Section title="Currency">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Currency Code *" error={errors.currency?.message}>
              <Input
                placeholder="e.g. BDT, USD, EUR"
                {...register("currency", { required: "Currency code is required" })}
              />
            </Field>
            <Field label="Currency Symbol *" error={errors.currencySymbol?.message}>
              <Input
                placeholder="e.g. ৳, $, €"
                {...register("currencySymbol", { required: "Currency symbol is required" })}
              />
            </Field>
          </div>
          <p className="text-xs text-muted-foreground">
            The symbol is displayed throughout the admin (prices, invoices, emails).
          </p>
        </Section>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving || !isDirty} className="w-36">
            {saving ? "Saving..." : "Save Settings"}
          </Button>
          <Button type="button" variant="outline" onClick={() => reset()} disabled={!isDirty}>
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
}
