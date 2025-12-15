import * as Yup from "yup";

export const createCustomersSchema = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string().email().required(),
    status: Yup.string().required(),
});

export const updateCustomersSchema = Yup.object().shape({
    name: Yup.string(),
    email: Yup.string().email(),
    role: Yup.string(),
    file_id: Yup.number(),
    oldPassword: Yup.string().min(8),
    password: Yup.string().min(8).when('oldPassword', (oldPassword, field) =>
        oldPassword ? field.required() : field
    ),
    passwordConfirmation: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
    ),
});
