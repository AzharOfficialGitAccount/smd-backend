import express from 'express';
import * as controller from '../../../controller/user/auth';
import * as commonController from '../../../controller/common/common';
import * as schema from '../../../validation/common';
import { reqValidator } from '../../../middleware/requestValidator';
import { verifyAuthToken } from '../../../middleware/auth';

const router = express.Router();

router.post('/register', reqValidator(schema.register), controller.register);
router.post('/login', reqValidator(schema.login), controller.login, commonController.createSession as any);
router.get('/dashboard', verifyAuthToken, controller.dashboard);

export default router;
