export function titleCase(s: string) {
    const formatted = s[0].toUpperCase() + s.slice(1);
    return formatted;
}
