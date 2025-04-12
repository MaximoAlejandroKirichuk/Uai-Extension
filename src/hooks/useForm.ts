import { useState } from "react";

export const useForm = (intial = {}) => {
    const [formState, setFormState] = useState(intial)

    const onInputChange = ({target}) => {
        const {name, value} = target;
        setFormState({
            ...formState,
            [name]: value
        })
    }
    const onResetForm = () => {
        setFormState(intial)
    }
    return {
        ...formState,
        formState,
        onInputChange,
        onResetForm
  }
}