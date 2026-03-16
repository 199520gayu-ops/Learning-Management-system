import express from "express";
import {
getStudents,
updateStudent,
deleteStudent
} from "../controllers/studentController.js";

import { protect } from "../middleware/authMiddleware.js";
import { roleCheck } from "../middleware/roleMiddleware.js";

const router = express.Router();

/* ONLY EDUCATOR OR COORDINATOR CAN ACCESS */

router.get(
"/",
protect,
roleCheck(["educator","coordinator"]),
getStudents
);

router.put(
"/:id",
protect,
roleCheck(["educator","coordinator"]),
updateStudent
);

router.delete(
"/:id",
protect,
roleCheck(["educator","coordinator"]),
deleteStudent
);

export default router;