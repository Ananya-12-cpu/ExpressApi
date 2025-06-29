const { Sequelize } = require("sequelize");
const User = require("../models/User");
const Todo = require("../models/Todo");
const { Op } = require("sequelize");

var addTodo = async (req, res) => {
  try {
    const postData = req.body;
    data = await Todo.create(postData);
    res.status(200).json({ data: data });
  } catch (error) {
    console.log("error", error);
  }
};

var getTodos = async (req, res) => {
  try {
    const filters = {};
    if (req.query.title !== undefined) {
      filters.title = req.query.title;
    }
    if (req.query.description !== undefined) {
      filters.description = req.query.description;
    }

    // Global search

    let globalSearch = null;
    let attributes = undefined;



    if (req.query._search && req.query._search_fields) {
      // if _search_fields , _search exists in Global search
      const searchTerm = req.query._search; 
      const fields = req.query._search_fields
        .split(",")
        .map((field) => field?.trim())
        // .filter((field) => field?.length > 0); // optional: removes empty strings

      // Build dynamic OR conditions for each requested field
      globalSearch = {
        [Op.or]: fields.map((field) => ({
          [field]: { [Op.like]: `%${searchTerm}%` },
        })),
      };
    } else if (req.query._search && !req.query._search_fields) {
      // if only _search exists in Global search

      const searchTerm = req.query._search;
      globalSearch = {
        [Op.or]: [
          { title: { [Op.like]: `%${searchTerm}%` } },
          { description: { [Op.like]: `%${searchTerm}%` } },
        ],
      };
    }
    
    // dynamic fetch fields
    
    if (req.query._show_fields) {
      attributes = req.query._show_fields
        .split(",")
        .map((field) => field.trim())
        // .filter((field) => field.length > 0);
    }

    // Combine filters and global search
    const whereCondition = globalSearch
      ? { ...filters, ...globalSearch }
      : filters;

    // Pagination parameters
    const page = parseInt(req.query._page) || 1;
    const limit = parseInt(req.query._limit) || 5;
    const offset = (page - 1) * limit;

    // Sorting parameters
    const sortBy = req.query._sort_by || "createdAt";
    const sortOrder = req.query._sort_order === "DESC" ? "DESC" : "ASC";

    // Get paginated data
    const todos = await Todo.findAll({
      where: whereCondition,
      attributes:attributes || undefined,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name"], // User attributes
        },
      ],
      limit: limit,
      offset: offset,
      order: [[sortBy, sortOrder]],
    });

    // Get total count for pagination metadata
    const totalCount = await Todo.count({ where: whereCondition });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      status: "success",
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalCount,
        itemsPerPage: limit,
        hasNextPage: hasNextPage,
        hasPrevPage: hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null,
      },
      data: todos,
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch todos",
    });
  }
};

// // /todos/1

var getPostWithUser = async (req, res) => {
  try {
    const todo = await Todo.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name"], // User attributes
        },
      ],
    });

    if (!todo) {
      return res.status(404).json({
        status: "error",
        message: "Todo not found",
      });
    }

    res.status(200).json({
      status: "success",

      data: todo,
    });
  } catch (error) {
    console.error("Error fetching todo with user:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch todo with user details",
    });
  }
};

var deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);

    if (!todo) {
      return res.status(404).json({
        status: "error",
        message: "Todo not found",
      });
    }

    await todo.destroy();
    res.status(200).json({
      status: "success",
      message: "Todo deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete user",
    });
  }
};

var patchTodo = async (req, res) => {
  try {
    var updatedData = req.body;

    // First, check if the todo exists
    const existingTodo = await Todo.findByPk(req.params.id);
    if (!existingTodo) {
      return res.status(404).json({
        status: "error",
        message: "Todo not found",
      });
    }

    // Update the todo
    await Todo.update(updatedData, {
      where: {
        id: req.params.id,
      },
    });

    // Fetch the updated todo with user details
    const updatedTodo = await Todo.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name"],
        },
      ],
    });

    res.status(200).json({
      status: "success",
      message: "Todo updated successfully",
      data: updatedTodo,
    });
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to update todo",
    });
  }
};

module.exports = {
  addTodo,
  getTodos,
  getPostWithUser,
  patchTodo,
  deleteTodo,
};
