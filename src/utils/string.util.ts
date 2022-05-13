export function titleCase(s: string | undefined) {
    if (!s) {
        return;
    }
    const formatted = s[0].toUpperCase() + s.slice(1);
    return formatted;
}
