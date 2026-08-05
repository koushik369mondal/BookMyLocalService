/**
 * Prisma select object for fetching safe user details
 */
const userSelect = {
    id: true,
    fullName: true,
    email: true,
    phone: true,
    role: true,
    avatar: true,
    isVerified: true,
    address: true,
    city: true,
    state: true,
    zipCode: true,
    createdAt: true,
    updatedAt: true
};

/**
 * Format user object for API responses by excluding sensitive / internal fields.
 * @param {object} user - User record from Prisma
 * @returns {object} Safe user object
 */
const toSafeUser = (user) => {
    if (!user) return null;
    const { password, otpHash, otpExpiresAt, otpAttempts, ...safeUser } = user;
    const imgUrl = safeUser.avatar || safeUser.profileImage || null;
    return {
        ...safeUser,
        avatar: imgUrl,
        profileImage: imgUrl
    };
};

module.exports = {
    userSelect,
    toSafeUser
};
