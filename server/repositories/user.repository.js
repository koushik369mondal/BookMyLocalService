const prisma = require("../config/prisma");
const { userSelect } = require("../utils/user.util");

/**
 * Repository layer for User entity database operations.
 */
class UserRepository {
    async findById(id, select = userSelect) {
        return await prisma.user.findUnique({
            where: { id },
            select
        });
    }

    async findByEmail(email, select = null) {
        const query = { where: { email: email.toLowerCase().trim() } };
        if (select) query.select = select;
        return await prisma.user.findUnique(query);
    }

    async findFirstByRole(role) {
        return await prisma.user.findFirst({
            where: { role }
        });
    }

    async findManyByPhone(phone) {
        return await prisma.user.findMany({
            where: { phone: phone.trim() }
        });
    }

    async create(data, select = userSelect) {
        return await prisma.user.create({
            data,
            select
        });
    }

    async update(id, data, select = userSelect) {
        return await prisma.user.update({
            where: { id },
            data,
            select
        });
    }

    async delete(id) {
        return await prisma.user.delete({
            where: { id }
        });
    }

    async deleteManyByEmail(email) {
        return await prisma.user.deleteMany({
            where: { email: email.toLowerCase().trim() }
        });
    }
}

module.exports = new UserRepository();
