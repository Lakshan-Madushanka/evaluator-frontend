import { helpers } from "@vuelidate/validators";

export const password = helpers.regex(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
);

/* export const password = (value) => {
  console.log("lakshan", value);
  return true;
};
 */
export const massages = {
  password:
    "Invalid password, at least one lowercase, at least one uppercase, at least one numeric, at least one special character and minimum 8 characters",
};
