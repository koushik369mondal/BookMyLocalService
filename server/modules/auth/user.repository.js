const prisma = require("../../config/prisma");
const { userSelect } = require("../../utils/user.util");

class UserRepository {
    async findById(id) {
        return await prisma.user.findUnique({
            where: { id },
            select: userSelect
        });
    }

    async findByEmail(email) {
        return await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() }
        });
    }

    async create(userData) {
        return await prisma.user.create({
            data: {
                ...userData,
                email: userData.email.toLowerCase().trim()
            }
        });
    }

    async update(id, updateData) {
        if (updateData.email) {
            updateData.email = updateData.email.toLowerCase().trim();
        }
        return await prisma.user.update({
            where: { id },
            data: updateData,
            select: userSelect
        });
    }

    async delete(id) {
        return await prisma.user.delete({
            where: { id }
        });
    }
}

module.exports = new UserRepository();
