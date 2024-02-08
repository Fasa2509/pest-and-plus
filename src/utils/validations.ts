// validación para correos electrónicos
export const isValidEmail = (email: string): boolean =>
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);

// validación de string para slug
export const isValidStringForSlug = (title: string): boolean =>
    /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ!¡¿?\(\) ]*$/.test(title);

// validación de slug
export const isValidSlug = (slug: string): boolean =>
    /^[a-z0-9\(\)\_]*$/.test(slug);
