const { Sequelize } = require("sequelize");
const User = require("../models/User");
const Todo = require("../models/Todo");
const { Op } = require("sequelize");

var addUser = async (req, res) => {
  try {
    const postData = req.body;
    data = await User.create(postData);
    res.status(200).json({ data: data });
  } catch (error) {
    console.log("error", error);
  }
};

var getUsers = async (req, res) => {
  try {
    const filters = {};
    if (req.query.name !== undefined) {
      filters.name = req.query.name;
    }
    if (req.query.email !== undefined) {
      filters.email = req.query.email;
    }

    // Global search

    let globalSearch = null;
    let attributes = undefined;
    
    if (req.query._search && req.query._search_fields) {
      // if _search_fields , _search exists in Global search
      const searchTerm = req.query._search;
      const fields = req.query._search_fields
        .split(",")
        .map((field) => field?.trim()); // optional: removes empty strings

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
          { name: { [Op.like]: `%${searchTerm}%` } },
          { email: { [Op.like]: `%${searchTerm}%` } },
        ],
      };
    } else if (req.query._show_fields) {
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
    const limit = parseInt(req.query._limit) || 10;
    const offset = (page - 1) * limit;

    // Sorting parameters
    const sortBy = req.query._sort_by || "createdAt";
    const sortOrder = req.query._sort_order === "DESC" ? "DESC" : "ASC";

    // Find users with filters
    const users = await User.findAll({
      attributes: attributes || undefined, // only include if provided
      where: whereCondition,
      limit: limit,
      offset: offset,
      order: [[sortBy, sortOrder]], // order by query
    });

    // Get total count for pagination metadata
    const totalCount = await User.count({ where: filters });

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
      data: users,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// // /users/1/posts

var getUserCreatedPost = async (req, res) => {
  // Sorting parameters for todos
  const sortBy = req.query.sortBy || "createdAt";
  const sortOrder = req.query.sortOrder === "DESC" ? "DESC" : "ASC";

  const jane = await User.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Todo,
        as: "todos",
        attributes: ["id", "title", "description", "completed"],
        order: [[sortBy, sortOrder]],
      },
    ],
  }); // get all value from table

  res.status(200).json({ data: jane });
};

// // get user by id
// var getUser = async (req, res) => {
//   const jane = await User.findOne({
//     where: {
//       id: req.params.id,
//     },
//   }); // get all value from table

//   res.status(200).json({ data: jane });
// };

// const postUsers = async (req, res) => {
//   console.log("101 req.body:", req.body); // Logging the incoming request body

//   try {
//     const postData = req.body;
//     console.log("102 postData:", postData); // Logging the data to be posted

//     if (postData.length > 1) {
//       var data = await User.bulkCreate(postData);
//     } else {
//       if (!postData.firstName || !postData.lastName) {
//         return res
//           .status(400)
//           .json({ error: "firstName and lastName are required." });
//       }

//       data = await User.create(postData);
//     }
//     res.status(200).json({ data: data });
//   } catch (error) {
//     console.error("Error posting users:", error);
//     res.status(500).json({ error: "An error occurred while posting users." });
//   }
// };

var deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    await user.destroy();
    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete user",
    });
  }
};

var patchUser = async (req, res) => {
  var updatedData = req.body;
  const jane = await User.update(updatedData, {
    where: {
      id: req.params.id,
    },
  });

  res.status(200).json({ data: jane });
};

module.exports = {
  addUser,
  getUsers,
  getUserCreatedPost,
  patchUser,
  deleteUser,
};
