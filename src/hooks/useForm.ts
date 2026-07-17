import { useState, ChangeEvent } from "react";

export const useForm = <T extends Record<string, unknown>>(initial: T) => {
  const [formState, setFormState] = useState<T>(initial);

  const onInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value
    });
  };

  const onResetForm = () => {
    setFormState(initial);
  };

  return {
    ...formState,
    formState,
    onInputChange,
    onResetForm
  };
};
