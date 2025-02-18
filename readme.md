# STOCK MANAGEMENT API

## Deployment Link

[View Deployment](https://fullstack-stockapp-wfdx.onrender.com/)

### ERD:

![ERD](./erdStockAPI.png)

### ERD-2 (snake_case):

![ERD](./erdStockAPI2.png)

### Folder/File Structure:

    .env
    .gitignore
    index.js
    package.json
    readme.md
    src/
        config/
            dbConnection.js
            swagger.json
        controllers/
            auth.js
            brand.js
            category.js
            firm.js
            product.js
            purchase.js
            sale.js
            token.js
            user.js
        helpers/
            passwordEncrypt.js
            sendMail.js
        middlewares/
            authentication.js
            errorHandler.js
            findSearchSortPage.js
            logger.js
            permissions.js
            upload.js
        models/
            brand.js
            category.js
            firm.js
            product.js
            purchase.js
            sale.js
            token.js
            user.js
        routes/
            auth.js
            brand.js
            category.js
            document.js
            firm.js
            index.js
            product.js
            purchase.js
            sale.js
            token.js
            user.js

## You can add USERS table to StockAPP

1-When creating the first user, default: active and admin should not be there, so even if isAdmin: true comes, it should be deleted from the body, and it should not be in the same way in staff.

2- You add a table called users in the frontend panel. Admin or staff can see the entire list of this table, others can only see their own user information. Staff also cannot see admin information. We did something similar in Rentacar. (These accesses should be set in the Controller, you can also do similar filters in the frontend section)

3-In this panel, admin can give staff authority to users, delete and update them. When the password is changed, a verification link can be sent to the user's e-mail address. In real life, admin does not change the user password, but can restrict access.

4-Normal users can only change their own information, but cannot delete (Since normal users do not have the authority to delete in the Controller, the delete button is not shown in the frontend section. Only the buttons that they can perform are shown, which makes it more user-friendly.)

## Changes to be made on the client side

- "rename": "mv build ../public",
  "rename1": "mkdir -p ../public && mv build/\* ../public/"
- baseURL: "/api/v1",

## Changes to be made on the backend

- const path = require("node:path");
- app.use(express.static(path.resolve(\_\_dirname, "./public")));
- app.all("/api/v1", (req, res) => {
  res.send({
  error: false,
  message: "Welcome to Stock Management API",
  documents: {
  swagger: "/api/v1/documents/swagger",
  redoc: "/api/v1/documents/redoc",
  json: "/api/v1/documents/json",
  },
  user: req.user,
  });
  });
- app.use("/api/v1", require("./src/routes"));
- app.get("/", (req, res) => {
  /_
  #swagger.ignore = true
  _/
  res.sendFile(path.resolve(\_\_dirname, "./public", "index.html"));
  });

- "setup-production": "npm i && node swaggerAutogen && cd client && npm i && npm run build && npm run rename1",
- build komutu= "npm run setup-production"
  const mongoose = require("mongoose");

## The user will not be able to delete his own account but will send a request to the admin.

# Model

const DeleteRequestSchema = new mongoose.Schema(
{
userId: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
required: true,
},
requestedBy: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
required: true,
},
reason: {
type: String,
default: "",
},
status: {
type: String,
enum: ["Pending", "Approved", "Rejected"],
default: "Pending",
},
createdAt: {
type: Date,
default: Date.now,
},
},
{
collection: "deleteRequests",
}
);

module.exports = mongoose.model("DeleteRequest", DeleteRequestSchema);

## Controller-1 for users

const DeleteRequest = require("../models/DeleteRequest");

app.post("/request-delete", async (req, res) => {
if (req.user.isAdmin) {
return res.status(403).json({ message: "Admins cannot send delete requests." });
}

const { reason } = req.body;

const deleteRequest = new DeleteRequest({
userId: req.user.\_id,
requestedBy: req.user.\_id,
reason: reason || "No reason provided",
});

await deleteRequest.save();

res.status(201).json({ message: "Delete request sent to admin for approval." });
});

# Controller for Admin

app.post("/admin/delete-user/:id", async (req, res) => {
if (!req.user.isAdmin) {
return res.status(403).json({ message: "Not authorized" });
}

const { id } = req.params;

const deleteRequest = await DeleteRequest.findById(id);

if (!deleteRequest) {
return res.status(404).json({ message: "Delete request not found" });
}

if (deleteRequest.status !== "Pending") {
return res.status(400).json({ message: "This request has already been processed" });
}

const user = await User.findById(deleteRequest.userId);
if (!user) {
return res.status(404).json({ message: "User not found" });
}

// Delete the user
await User.findByIdAndDelete(user.\_id);

// Update the request status
deleteRequest.status = "Approved";
await deleteRequest.save();

// Notify the user
// Implement notification logic here (e.g., email notification)

res.status(200).json({ message: "User account deleted and admin notified." });
});
