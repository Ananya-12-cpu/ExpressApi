const Role = require('../models/Role');
const User = require('../models/User');
const UserRole = require('../models/UserRole');
const { Op } = require('sequelize');

// Create a new role
const createRole = async (req, res) => {
    try {
        const { name, description } = req.body;
        const role = await Role.create({ name, description });
        res.status(201).json({
            status: "success",
            data: role
        });
    } catch (error) {
        console.error("Error creating role:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to create role"
        });
    }
};

// Get all roles
const getRoles = async (req, res) => {
    try {
        // Global search

  let globalSearch = null;

    if (req.query._search && req.query._search_fields) {
      // if _search_fields , _search exists in Global search
      const searchTerm = req.query._search;
      const fields = req.query._search_fields
        .split(",")
        .map((field) => field?.trim());
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
          { name: { [Op.like]: `%${searchTerm}%` } },
          { description: { [Op.like]: `%${searchTerm}%` } },
        ],
      };
    }









        // let globalSearch = null;
        // if (req.query._search) {
        //     const searchTerm = req.query._search;
        //     globalSearch = {
        //         [Op.or]: [
        //             { name: { [Op.like]: `%${searchTerm}%` } },
        //             { description: { [Op.like]: `%${searchTerm}%` } },
        //         ],
        //     };
        // }

        // Pagination parameters
        const page = parseInt(req.query._page) || 1;
        const limit = parseInt(req.query._limit) || 10;
        const offset = (page - 1) * limit;

        // Sorting parameters
        const sortBy = req.query._sort_by || "createdAt";
        const sortOrder = req.query._sort_order === "DESC" ? "DESC" : "ASC";

        // Combine global search
        const whereCondition = globalSearch ? globalSearch : undefined;

        const { count, rows: roles } = await Role.findAndCountAll({
            where: whereCondition,
            order: [[sortBy, sortOrder]],
            limit: limit,
            offset: offset,
        });

        const totalPages = Math.ceil(count / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        res.status(200).json({
            status: "success",
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalItems: count,
                itemsPerPage: limit,
                hasNextPage: hasNextPage,
                hasPrevPage: hasPrevPage,
                nextPage: hasNextPage ? page + 1 : null,
                prevPage: hasPrevPage ? page - 1 : null,
            },
            data: roles
        });
    } catch (error) {
        console.error("Error fetching roles:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to fetch roles"
        });
    }
};

// Assign role to user
const assignRoleToUser = async (req, res) => {
    try {
        const { userId, roleId } = req.body;
        
        // Check if user and role exist
        const user = await User.findByPk(userId);
        const role = await Role.findByPk(roleId);

        if (!user || !role) {
            return res.status(404).json({
                status: "error",
                message: "User or role not found"
            });
        }

        // Create the association
        await UserRole.create({ userId, roleId });

        res.status(200).json({
            status: "success",
            message: "Role assigned successfully"
        });
    } catch (error) {
        console.error("Error assigning role:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to assign role"
        });
    }
};

// Get user with roles
const getUserWithRoles = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            include: [{
                model: Role,
                as: 'roles',
                attributes: ['id', 'name', 'description'],
                through: { attributes: [] }
            }]
        });

        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found"
            });
        }

        res.status(200).json({
            status: "success",
            data: user
        });
    } catch (error) {
        console.error("Error fetching user roles:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to fetch user roles"
        });
    }
};

module.exports = {
    createRole,
    getRoles,
    assignRoleToUser,
    getUserWithRoles
}; 