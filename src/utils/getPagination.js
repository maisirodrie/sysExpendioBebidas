
export const getPagination = (page, size) => {
    const limit = page ? +page : 10;
    const offset = size ? size * limit : 0;
    return { limit, offset }
}