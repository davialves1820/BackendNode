export function getPagination(query) {
    const page = Number(query.page) || 1;
    const limit = Math.min(Number(query.limit) || 25, 100);

    return {
        limit,
        offset: (page - 1) * limit,
    };
}

export function getOrder(sort, allowedFields = []) {
    if (!sort) return [];

    return sort
        .split(",")
        .map(item => item.split(":"))
        .filter(([field]) => allowedFields.includes(field));
}
