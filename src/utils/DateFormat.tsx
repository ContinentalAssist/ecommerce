export default function DateFormat(date:any)
{
    return new Date(
        new Date(date).getFullYear() +
        "-" +
        (new Date(date).getMonth() + 1 < 10 ? "0" + (new Date().getMonth() + 1) : new Date().getMonth() + 1) +
        "-" +
        (new Date(date).getDate() < 10 ? "0" + new Date().getDate() : new Date().getDate())
    ).toISOString().substring(0, 10)
}