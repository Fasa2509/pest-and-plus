import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export const getTimeToNow = (date: Date) => {
    const fromNow = formatDistanceToNow(date, { locale: es });

    return `hace ${fromNow}`;
};

// export const getSinceTime = (date: Date): string => {

//     date = new Date(date);

//     const now = new Date().getTime();

//     const then = date.getTime();

//     const diff = Math.ceil(((now - then) / 1000));

//     console.log({ diff })

//     if (diff < 60) return 'hace menos de un minuto';

//     if (diff < 3600) return `hace ${Math.floor(diff % 60)} minutos`;

//     if (diff < 3600 * 24) return `hace ${Math.floor(diff % 3600)} horas`;

//     if (diff < 3600 * 24 * 7) return `hace ${Math.floor(diff & (3600 * 24))} días`;

//     return date.toTimeString();
// };
