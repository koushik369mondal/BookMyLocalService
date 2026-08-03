const categoryRepository = require("./category.repository");

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

class CategoryService {
  async getAllCategories(includeInactive = false) {
    const where = includeInactive ? {} : { isActive: true };
    const categories = await categoryRepository.findAll(where);
    return categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon || "Briefcase",
      imageUrl: cat.imageUrl || "",
      description: cat.description || "",
      isActive: cat.isActive,
      serviceCount: cat._count?.services || 0
    }));
  }

  async getCategoryById(id) {
    let category = await categoryRepository.findById(id);
    if (!category) {
      category = await categoryRepository.findBySlug(id);
    }
    if (!category) {
      throw new Error("Category not found.");
    }
    return {
      ...category,
      serviceCount: category._count?.services || 0
    };
  }

  async createCategory(data) {
    if (!data.name || !data.name.trim()) {
      throw new Error("Category name is required.");
    }
    const name = data.name.trim();
    const existing = await categoryRepository.findByName(name);
    if (existing) {
      throw new Error("A category with this name already exists.");
    }

    let slug = data.slug ? generateSlug(data.slug) : generateSlug(name);
    let counter = 1;
    let baseSlug = slug;
    while (await categoryRepository.findBySlug(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return await categoryRepository.create({
      name,
      slug,
      icon: data.icon ? data.icon.trim() : "Briefcase",
      imageUrl: data.imageUrl ? data.imageUrl.trim() : null,
      description: data.description ? data.description.trim() : null,
      isActive: data.isActive !== undefined ? Boolean(data.isActive) : true
    });
  }

  async updateCategory(id, data) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new Error("Category not found.");
    }

    const updateData = {};
    if (data.name) {
      const name = data.name.trim();
      const existing = await categoryRepository.findByName(name);
      if (existing && existing.id !== id) {
        throw new Error("Another category with this name already exists.");
      }
      updateData.name = name;
      if (!data.slug) {
        updateData.slug = generateSlug(name);
      }
    }

    if (data.slug) {
      updateData.slug = generateSlug(data.slug);
    }

    if (data.icon !== undefined) updateData.icon = data.icon ? data.icon.trim() : "Briefcase";
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl ? data.imageUrl.trim() : null;
    if (data.description !== undefined) updateData.description = data.description ? data.description.trim() : null;
    if (data.isActive !== undefined) updateData.isActive = Boolean(data.isActive);

    return await categoryRepository.update(id, updateData);
  }

  async deleteCategory(id) {
    const serviceCount = await categoryRepository.countServices(id);
    if (serviceCount > 0) {
      throw new Error(`Cannot delete category. There are ${serviceCount} service(s) currently linked to this category.`);
    }
    return await categoryRepository.delete(id);
  }
}

module.exports = new CategoryService();
