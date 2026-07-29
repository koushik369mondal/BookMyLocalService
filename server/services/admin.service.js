const adminRepository = require("../repositories/admin.repository");

const getAllUsers = async (filters = {}) => {
    const { role, search } = filters;
    const where = {};

    if (role && role !== "all") {
        where.role = role.toUpperCase();
    }

    if (search && search.trim() !== "") {
        const q = search.trim();
        where.OR = [
            { fullName: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } }
        ];
    }

    return await adminRepository.findAllUsers(where);
};

const getAllProviders = async (filters = {}) => {
    const { search } = filters;
    const where = {};

    if (search && search.trim() !== "") {
        const q = search.trim();
        where.OR = [
            { fullName: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } }
        ];
    }

    return await adminRepository.findAllProviders(where);
};

const verifyProvider = async (id, isVerified) => {
    return await adminRepository.verifyUser(id, isVerified);
};

const deleteUser = async (id) => {
    return await adminRepository.deleteUser(id);
};

module.exports = {
    getAllUsers,
    getAllProviders,
    verifyProvider,
    deleteUser
};
