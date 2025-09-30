"use client";
import { FormField } from "@/components/FormField";
import { updateDocumentById } from "@/modules/sanity";
import { useForm } from "react-hook-form";

export const EditPage = ({ member }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      lichessUsername: member.lichessUsername || "",
    },
    // resolver: superstructResolver(FormData),
  });

  // console.log(watch("username"));

  const onSubmit = async (values) => {
    await updateDocumentById(member._id, {
      lichessUsername: values.lichessUsername,
    });
    window.location = window.location;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField name="name" label="Name" value={member.name} />
        <FormField label="Pnum" readOnly aria-readonly value={member.pnum} />
        <FormField {...register("lichessUsername")} label="Lichess username" />
        <button type="submit">Save</button>
      </form>

      <pre>{JSON.stringify({ member }, null, 2)}</pre>
    </div>
  );
};
