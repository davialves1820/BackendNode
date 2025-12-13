import * as Yup from "yup";

export const createContactSchema = Yup.object({
    name: Yup.string().required(),
    email: Yup.string().email().required(),
    status: Yup.string().oneOf(["ACTIVE", "ARCHIVED"]).required(),
});

export const updateContactSchema = Yup.object({
    name: Yup.string(),
    email: Yup.string().email(),
    status: Yup.string().oneOf(["ACTIVE", "ARCHIVED"]),
});
