"use client";
import { FormField } from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { updateMyself } from "@/modules/turso";
import { Member, MemberPartial, MemberStringified } from "@/modules/schema";
import { useForm } from "react-hook-form";
import { create } from "superstruct";

export const EditPage = ({ member }: { member: Member }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...create(member, MemberStringified),
    },
    resolver: (schema, _, args) => {
      console.log(schema, _, args);
      const errors = {};
      try {
        const values = create(schema, Member);
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
    window.location.replace(window.location.href);
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
        <FormField
          {...registerWithErrors("chesscomUsername")}
          label="Chess.com username"
        />
        <FormField
          {...registerWithErrors("allegroLive")}
          label="Allegro Live"
        />
        <FormField
          {...registerWithErrors("allegroPublished")}
          label="Allegro Published"
        />
        <FormField
          {...registerWithErrors("standardLive")}
          label="Standard Live"
        />
        <FormField
          {...registerWithErrors("standardPublished")}
          label="Standard Published"
        />
        {/* <FormField {...registerWithErrors("isAdmin")} label="Is admin" />
        <FormField {...registerWithErrors("active")} label="Is active" /> */}
        <Button type="submit" className="mt-4">
          Save
        </Button>
      </form>
    </div>
  );
};
