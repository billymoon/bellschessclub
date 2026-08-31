"use client";
import { FormField } from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { updateMyself } from "@/modules/turso";
import { MemberDocument, MemberPartial, MemberStringified } from "@/modules/schema";
import { useForm } from "react-hook-form";
import { create } from "superstruct";
import { FormFieldSelect } from "@/components/FormFieldSelect";
import { cn } from "@/lib/utils";

export const EditPage = ({ member }: { member: MemberDocument }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...create({
        ...member,
        allegroIsEstimated: member.allegroIsEstimated ? true : false,
        standardIsEstimated: member.standardIsEstimated ? true : false,
      }, MemberStringified),
    },
    resolver: (schema, _) => {
      const errors = {};
      try {
        const values = create(schema, MemberDocument);
        return {
          errors,
          values,
        };
      } catch (err) {
        return {
          errors: {
            [err.key]: err.message,
          },
        };
      }
    },
  });

  const onSubmit = async (formValues: MemberPartial) => {
    const values = create(formValues, MemberPartial);
    // if (values.lichessUsername) {
    //   values.username = values.lichessUsername;
    // }
    await updateMyself(values);
  };

  const registerWithErrors = (fieldName) => ({
    ...register(fieldName),
    error: errors[fieldName]?.toString(),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField {...registerWithErrors("name")} label="Name" />
        <FormField {...registerWithErrors("pnum")} label="Pnum" />
        {/* <FormField
          {...registerWithErrors("lichessUsername")}
          label="Lichess username"
        /> */}
        {/* <FormField
          {...registerWithErrors("chesscomUsername")}
          label="Chess.com username"
        /> */}
        <FormField
          {...registerWithErrors("allegroPublished")}
          label="Allegro Rating"
        />
        <FormFieldSelect
          label="Allegro is estimated"
        >
          <select
            {...registerWithErrors("allegroIsEstimated")}
            className={cn(
              "placeholder:text-muted-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border appearance-none",
              "bg-transparent px-2 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            )}
          >
            <option value="false">Published</option>
            <option value="true">Estimated</option>
          </select>
        </FormFieldSelect>
        <FormField
          {...registerWithErrors("standardPublished")}
          label="Standard Rating"
        />
        <FormFieldSelect
          label="Standard is estimated"
        >
          <select
            {...registerWithErrors("standardIsEstimated")}
            className={cn(
              "placeholder:text-muted-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border appearance-none",
              "bg-transparent px-2 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            )}
          >
            <option value="false">Published</option>
            <option value="true">Estimated</option>
          </select>
        </FormFieldSelect>
        {/* <FormField {...registerWithErrors("isAdmin")} label="Is admin" />
        <FormField {...registerWithErrors("active")} label="Is active" /> */}
        <Button type="submit" className="mt-4">
          Save
        </Button>
      </form>
    </div>
  );
};
