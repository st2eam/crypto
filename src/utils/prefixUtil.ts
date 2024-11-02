const defaultPrefix = "@@@"

export function setPrefix(newPrefix: string) {
    localStorage.setItem('prefix', newPrefix)
}

export function getPrefix() {
    const _prefix = localStorage.getItem('prefix')
    if (!_prefix) {
        setPrefix(defaultPrefix)
        return defaultPrefix
    }
    return _prefix
}