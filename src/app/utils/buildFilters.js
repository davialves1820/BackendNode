import { Op } from "sequelize";
import { parseISO } from "date-fns";

export function buildFilters(query, allowedFields = []) {
    const where = {};

    for (const field of allowedFields) {
        if (query[field]) {
            where[field] = { [Op.iLike]: `%${query[field]}%` };
        }
    }

    if (query.status) {
        where.status = {
            [Op.in]: query.status.split(",").map(s => s.toUpperCase()),
        };
    }

    if (query.createdBefore || query.createdAfter) {
        where.createdAt = {};
        if (query.createdBefore) where.createdAt[Op.lte] = parseISO(query.createdBefore);
        if (query.createdAfter) where.createdAt[Op.gte] = parseISO(query.createdAfter);
    }

    if (query.updatedBefore || query.updatedAfter) {
        where.updatedAt = {};
        if (query.updatedBefore) where.updatedAt[Op.lte] = parseISO(query.updatedBefore);
        if (query.updatedAfter) where.updatedAt[Op.gte] = parseISO(query.updatedAfter);
    }

    return where;
}
