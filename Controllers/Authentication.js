const Auth = require("../Models/Auth")
const GetToken = require("../Connection/functions");
const bcrypt = require("bcrypt");


exports.createAuth = async (req, res) => {
    const { username, password, email, mobile } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const data = {
            username,
            password: hashedPassword,
            email,
            mobile
        };

        await Auth.create(data);
        res.status(200).send({ message: "User created successfully!" });
    } catch (err) {
        console.log(err);
        res.status(400).send({ message: "Invalid action" });
    }
};
exports.updateAuth = async (req, res) => {
    const body = req.body;
    const token = GetToken(req)
    const auth_id = token.auth_id
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const data = {
        username: body.username,
        password: hashedPassword,
        email: body.email,
        mobile: body.mobile
    }

    try {
        const create = await Auth.update(data, {
            where: {
                auth_id: auth_id

            }
        })
        res.status(200).send({ message: "user updated successfully !!" })
    } catch (err) {
        console.log(err)
        res.status(400).send({ message: "Invalid action" })
    }
}
exports.getAuth = async (req, res) => {
    try {
        const getAuth = await Auth.findAll({})
        res.status(200).send({ data: getAuth })
    } catch (err) {
        console.log(err);
        res.status(400).send({ message: "Invalid action" })

    }
}
exports.getAuthById = async (req, res) => {
    console.log(req);

    const token = GetToken(req)

    const auth_id = token.auth_id;

    try {
        const user = await Auth.findOne({ where: { auth_id } });

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        res.status(200).send({ data: user });
    } catch (err) {
        console.log(err);
        res.status(400).send({ message: "Invalid action" });
    }
};
exports.deleteAuthById = async (req, res) => {
    const token = GetToken(req);
    const auth_id = token.auth_id;

    try {
        const deleted = await Auth.destroy({ where: { auth_id } });

        if (!deleted) {
            return res.status(404).send({ message: "User not found" });
        }

        res.status(200).send({ message: "User deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(400).send({ message: "Invalid action" });
    }
};
