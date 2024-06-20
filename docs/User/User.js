

//Register
/**
 * @swagger
 * /api/signup:
 *   post:
 *     summary: User Singup
 *     security:
 *       - bearerAuth: []
 *     tags:
 *        - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                username:
 *                  type: string
 *                  example: "xyz123"
 *                password:
 *                  type: string
 *                  example: "123455hdj"
 *                email:
 *                  type: string
 *                  example: "myemail@gmail.com"
 *                mobileNumber:
 *                 type: string
 *                 example: "12356789"
 *                firstName:
 *                 type: string
 *                 example: "1234567890"
 *                lastName:
 *                 type: string
 *                 example: "123jk"
 *                passphrase:
 *                 type: string
 *                 example: "admin"
 *
 *
 *
 *     responses:
 *       200:
 *         description: successful
 *       400:
 *         description: invalid arguments, please try again
 *       401:
 *         description: unauthorized request, please check again
 *       403:
 *         description: forbidden request, please check login credentials
 *       404:
 *         description: data not found, please try again
 *       409:
 *         description: conflict happened, we do not allow duplicate entries, please try again.
 *       500:
 *         description: internal server error occurred, please try again
 *
 */

//Login
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: User Login
 *     security:
 *       - bearerAuth: []
 *     tags:
 *        - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                email:
 *                  type: string
 *                  example: "myemail@gmail.com"
 *                password:
 *                  type: string
 *                  example: "124abc"
 *                
 *
 *
 *
 *     responses:
 *       200:
 *         description: successful
 *       400:
 *         description: invalid arguments, please try again
 *       401:
 *         description: unauthorized request, please check again
 *       403:
 *         description: forbidden request, please check login credentials
 *       404:
 *         description: data not found, please try again
 *       409:
 *         description: conflict happened, we do not allow duplicate entries, please try again.
 *       500:
 *         description: internal server error occurred, please try again
 *
 */


//Get Property List
/**
 * @swagger
 * /api/properties:
 *   get:
 *     summary: Get Property List
 *     security:
 *       - bearerAuth: []
 *     tags:
 *        - User
 *     description: Get Property List
 *                
 *
 *
 *
 *     responses:
 *       200:
 *         description: successful
 *       400:
 *         description: invalid arguments, please try again
 *       401:
 *         description: unauthorized request, please check again
 *       403:
 *         description: forbidden request, please check login credentials
 *       404:
 *         description: data not found, please try again
 *       409:
 *         description: conflict happened, we do not allow duplicate entries, please try again.
 *       500:
 *         description: internal server error occurred, please try again
 *
 */

/**
 * @swagger
 * /api/property/{propertyId}:
 *   get:
 *     summary: Get Property By Id
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *         example: "1234567890"
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Invalid arguments, please try again
 *       401:
 *         description: Unauthorized request, please check again
 *       403:
 *         description: Forbidden request, please check login credentials
 *       404:
 *         description: Data not found, please try again
 *       409:
 *         description: Conflict happened, we do not allow duplicate entries, please try again
 *       500:
 *         description: Internal server error occurred, please try again
 */


/**
 * @swagger
 * /api/property/invest:
 *   post:
 *     summary: Invest in Property
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyId:
 *                 type: string
 *                 example: "1234567890"
 *               amount:
 *                 type: string
 *                 example: "3000"
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Invalid arguments, please try again
 *       401:
 *         description: Unauthorized request, please check again
 *       403:
 *         description: Forbidden request, please check login credentials
 *       404:
 *         description: Data not found, please try again
 *       409:
 *         description: Conflict happened, we do not allow duplicate entries, please try again
 *       500:
 *         description: Internal server error occurred, please try again
 */


/**
 * @swagger
 * /api/wallet:
 *   get:
 *     summary: Get Wallet Balance
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Invalid arguments, please try again
 *       401:
 *         description: Unauthorized request, please check again
 *       403:
 *         description: Forbidden request, please check login credentials
 *       404:
 *         description: Data not found, please try again
 *       409:
 *         description: Conflict happened, we do not allow duplicate entries, please try again
 *       500:
 *         description: Internal server error occurred, please try again
 */

/**
 * @swagger
 * /api/invest:
 *   post:
 *     summary: Invest in Property
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyId:
 *                 type: string
 *                 example: "1234567890"
 *               amount:
 *                 type: string
 *                 example: "3000"
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Invalid arguments, please try again
 *       401:
 *         description: Unauthorized request, please check again
 *       403:
 *         description: Forbidden request, please check login credentials
 *       404:
 *         description: Data not found, please try again
 *       409:
 *         description: Conflict happened, we do not allow duplicate entries, please try again
 *       500:
 *         description: Internal server error occurred, please try again
 */

/**
 * @swagger
 * /api/updateProfile:
 *   put:
 *     summary: Update Profile
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "xyz123"
 *               password:
 *                 type: string
 *                 example: "123455hdj"
 *               email:
 *                 type: string
 *                 example: "example@example.com"
 *               mobileNumber:
 *                 type: string
 *                 example: "12356789"
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Invalid arguments, please try again
 *       401:
 *         description: Unauthorized request, please check again
 *       403:
 *         description: Forbidden request, please check login credentials
 *       404:
 *         description: Data not found, please try again
 *       409:
 *         description: Conflict happened, we do not allow duplicate entries, please try again
 *       500:
 *         description: Internal server error occurred, please try again
 */

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get Profile
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Invalid arguments, please try again
 *       401:
 *         description: Unauthorized request, please check again
 *       403:
 *         description: Forbidden request, please check login credentials
 *       404:
 *         description: Data not found, please try again
 *       409:
 *         description: Conflict happened, we do not allow duplicate entries, please try again
 *       500:
 *         description: Internal server error occurred, please try again
 */
