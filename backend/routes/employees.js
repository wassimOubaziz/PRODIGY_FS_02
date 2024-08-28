const express = require("express");
const Employee = require("../models/Employee");
const router = express.Router();

// Get all employees
router.get("/", async (req, res) => {
  const { role, id } = req.user;
  try {
    let employees;
    if (role === "admin") {
      employees = await Employee.find().populate("manager");
    } else if (role === "manager") {
      employees = await Employee.find({ manager: id }).populate("manager");
    }
    if (!employees) {
      employees = [];
    }
    res.json(employees);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create employee
router.post("/", async (req, res) => {
  const { name, email, position, manager } = req.body;
  try {
    const newEmployee = new Employee({ name, email, position, manager });
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update employee
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, position } = req.body;
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { name, email, position },
      { new: true }
    );
    res.json(updatedEmployee);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete employee
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Employee.findByIdAndDelete(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
