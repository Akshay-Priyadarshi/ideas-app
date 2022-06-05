import { body } from "express-validator";

export const createIdeaVS = [
    body("title")
        .notEmpty()
        .withMessage("title is required")
        .isString()
        .isLength({ min: 3, max: 100 })
        .withMessage("title must be 3 to 100 characters"),
    body("desc")
        .notEmpty()
        .withMessage("desc is required")
        .isString()
        .isLength({ min: 100, max: 1000 })
        .withMessage("desc must be 100 to 1000 characters"),
    body("solvedProblem")
        .optional()
        .isString()
        .isLength({ min: 100, max: 1000 })
        .withMessage("solvedProblem must be 100 to 1000 characters"),
    body("ideator")
        .notEmpty()
        .withMessage("ideator is required")
        .isMongoId()
        .withMessage("ideator id is not valid"),
];

