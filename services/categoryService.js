const Category = require('../models/Categories');

exports.getAllCategories = async () => {
  return await Category.find();
};

exports.getCategoryById = async (id) => {
  const category = await Category.findById(id);
  if (!category) throw new Error('Category not found');
  return category;
};

exports.createCategory = async (data) => {
  const category = new Category(data);
  return await category.save();
};

exports.updateCategory = async (id, data) => {
  const updated = await Category.findByIdAndUpdate(id, data, { new: true });
  if (!updated) throw new Error('Category not found');
  return updated;
};

exports.deleteCategory = async (id) => {
  const deleted = await Category.findByIdAndDelete(id);
  if (!deleted) throw new Error('Category not found');
  return deleted;
};
