"use client";

import React, { useState, useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MDEditor from "@uiw/react-md-editor"; // Markdown editor package
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
// import { createPitch } from "@/lib/actions";

const StartupForm = () => {
  // Record<string, string> is a type that represents an object where the keys are strings and the values are also strings.
  const [errors, setErrors] = useState<Record<string, string>>({} as Record<string, string>);
  const [pitch, setPitch] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string,
        pitch,
      };

      await formSchema.parseAsync(formValues); // validating the form data using zod (formSchema)

      // const result = await createPitch(prevState, formData, pitch);

      // if (result.status == "SUCCESS") {
      //   toast({
      //     title: "Success",
      //     description: "Your startup pitch has been created successfully",
      //   });

      //   router.push(`/startup/${result._id}`);
      // }

      // return result;
    } catch (error) {

      // checking if the error is a zod error
      if (error instanceof z.ZodError) {
        const fieldErorrs = error.flatten().fieldErrors;

        // setting the errors state (the error message will automatically generate by zod)
        setErrors(fieldErorrs as unknown as Record<string, string>);

        toast({
          title: "Error",
          description: "Please check your inputs and try again",
          variant: "destructive",
        });

        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }

      // if the error is another type of error other than zod error
      toast({
        title: "Error",
        description: "An unexpected error has occurred",
        variant: "destructive",
      });

      return {
        ...prevState,
        error: "An unexpected error has occurred",
        status: "ERROR",
      };
    }
  };

  /**
   * useActionState hook
   *
   * This hook returns three values which represent the state of the
   * action (INITIAL, PENDING, SUCCESS, ERROR) and a function to
   * submit the form. The function returned by this hook accepts
   * a submit event and a function to handle the form data.
   *
   * This hook is useful because it allows us to manage the state
   * of a form in a simple and predictable way. It also handles
   * the pending state of the form, which is useful when we are
   * submitting the form to the server and we want to show a loading
   * indicator while the form is being submitted.
   *
   * The useActionState hook returns an array with three values:
   * - state: The current state of the form (INITIAL, PENDING, SUCCESS, ERROR)
   * - formAction: A function that accepts a submit event and a function
   *   to handle the form data.
   * - isPending: A boolean that is true if the form is currently being
   *   submitted and false otherwise.
   */
  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  });

  return (
    <form action={formAction} className="startup-form">
      <div>
        <label htmlFor="title" className="startup-form_label">
          Title
        </label>
        <Input
          id="title"
          name="title"
          className="startup-form_input"
          required
          placeholder="Startup Title"
        />

        {errors.title && <p className="startup-form_error">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="startup-form_label">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          className="startup-form_textarea"
          required
          placeholder="Startup Description"
        />

        {errors.description && (
          <p className="startup-form_error">{errors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="startup-form_label">
          Category
        </label>
        <Input
          id="category"
          name="category"
          className="startup-form_input"
          required
          placeholder="Startup Category (Tech, Health, Education...)"
        />

        {errors.category && (
          <p className="startup-form_error">{errors.category}</p>
        )}
      </div>

      <div>
        <label htmlFor="link" className="startup-form_label">
          Image URL
        </label>
        <Input
          id="link"
          name="link"
          className="startup-form_input"
          required
          placeholder="Startup Image URL"
        />

        {errors.link && <p className="startup-form_error">{errors.link}</p>}
      </div>

      <div data-color-mode="light">
        <label htmlFor="pitch" className="startup-form_label">
          Pitch
        </label>

        <MDEditor
          value={pitch}
          onChange={(value) => setPitch(value as string)}
          id="pitch"
          preview="edit"
          height={300}
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{
            placeholder:
              "Briefly describe your idea and what problem it solves",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />

        {errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
      </div>

      <Button
        type="submit"
        className="startup-form_btn text-white"
        disabled={isPending}
      >
        {isPending ? "Submitting..." : "Submit Your Pitch"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};

export default StartupForm;
