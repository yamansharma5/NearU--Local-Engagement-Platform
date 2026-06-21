const { Prisma } = require('@prisma/client');
const prisma = require('../../lib/prisma');

/**
 * Finds active posts within `radius` km of the given coordinates.
 *
 * The subquery computes distance once so we can filter on it in the outer WHERE
 * without repeating the formula — PostgreSQL doesn't allow referencing SELECT
 * aliases inside the same WHERE clause.
 *
 * LEAST(1.0, ...) clamps the acos argument to ≤1 because floating-point math
 * can produce values like 1.0000000002 for two identical points, which makes
 * acos return NaN and silently drops the row.
 */
const getNearbyPosts = async ({ lat, lng, radius = 5, type, categoryId }) => {
  // Prisma.empty is a no-op SQL fragment; conditions are injected only when the
  // filter param is present, keeping the base query clean and injection-safe.
  const typeFilter = type
    ? Prisma.sql`AND p."type"::text = ${type}`
    : Prisma.empty;

  const categoryFilter = categoryId
    ? Prisma.sql`AND b."categoryId" = ${categoryId}`
    : Prisma.empty;

  return prisma.$queryRaw`
    SELECT sub.*
    FROM (
      SELECT
        p.id,
        p."businessId",
        p."type",
        p.title,
        p.content,
        p.image,
        p.lat,
        p.lng,
        p."isActive",
        p.discount,
        p."validUntil",
        p."eventDate",
        p.venue,
        p."createdAt",
        p."updatedAt",
        b.name    AS "businessName",
        b.logo    AS "businessLogo",
        b.address AS "businessAddress",
        b."categoryId",
        (6371 * acos(
          LEAST(1.0,
            cos(radians(${lat})) * cos(radians(p.lat)) *
            cos(radians(p.lng)   - radians(${lng}))   +
            sin(radians(${lat})) * sin(radians(p.lat))
          )
        )) AS distance
      FROM "Post" p
      JOIN "Business" b ON p."businessId" = b.id
      WHERE p."isActive" = true
      ${typeFilter}
      ${categoryFilter}
    ) sub
    WHERE sub.distance < ${radius}
    ORDER BY sub.distance
    LIMIT 50
  `;
};

module.exports = { getNearbyPosts };
