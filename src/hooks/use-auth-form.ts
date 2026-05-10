import { useState } from "react";
import { useForm, DefaultValues, FieldValues, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

interface UseAuthFormOptions<T extends FieldValues> {
  schema: z.ZodType<T>;
  defaultValues: DefaultValues<T>;
  action: (formData: FormData) => Promise<{ error?: string } | undefined | void>;
  successMessage?: string;
  onSuccess?: () => void;
}

export function useAuthForm<T extends FieldValues>({
  schema,
  defaultValues,
  action,
  successMessage,
  onSuccess,
}: UseAuthFormOptions<T>) {
  const [loading, setLoading] = useState(false);
  
  const form = useForm<T>({
    resolver: zodResolver(schema as Parameters<typeof zodResolver>[0]) as unknown as Resolver<T>,
    defaultValues,
    mode: "onBlur",
  });

  const onSubmit = async (values: T) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          formData.append(key, typeof val === 'boolean' ? String(val) : (val as string));
        }
      });
      
      const result = await action(formData);
      
      if (result && "error" in result && result.error) {
        toast.error(result.error);
        return;
      }
      
      if (successMessage) {
        toast.success(successMessage);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.log(error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    handleSubmit: form.handleSubmit(onSubmit as unknown as Parameters<typeof form.handleSubmit>[0]),
  };
}
