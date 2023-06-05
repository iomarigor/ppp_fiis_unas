/*
    Action: Message
    Descripción: Acciones del componente Message de la aplicación, se ejecuta de manera global desde cualquier punto de la aplicación (aún está en construcción)
*/

export const HIDE_MESSAGE = "[MESSAGE] CLOSE";
export const SHOW_MESSAGE = "[MESSAGE] SHOW";

export function hideMessage() {
    return {
        type: HIDE_MESSAGE
    }
}

export function showMessage(options) {
    return {
        type: SHOW_MESSAGE,
        options
    }
}