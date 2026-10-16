const express = require("express");
const path = require("path");
const { foods, recommendFoods } = require("./foods");

const app = express();
const PORT = process.env.PORT || 3000;
const supportedGoals = ["High Protein", "Low Calorie", "Balanced Diet"];

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.get("/foods.js", (req, res) => res.sendFile(path.join(__dirname, "foods.js")));

app.get("/api/foods", (req, res) => {
  res.json({ success: true, count: foods.length, foods });
});

app.post("/api/recommend", (req, res) => {
  const body = req.body || {};
  const { goal, maxCalories, minProtein } = body;

  if (typeof goal !== "string" || goal.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Please select a nutrition goal."
    });
  }

  if (!supportedGoals.includes(goal)) {
    return res.status(400).json({
      success: false,
      message: "Please select a supported nutrition goal."
    });
  }

  if (maxCalories === undefined || maxCalories === null || maxCalories === "") {
    return res.status(400).json({
      success: false,
      message: "Please enter a calorie limit."
    });
  }

  const calorieLimit = Number(maxCalories);
  if (!Number.isFinite(calorieLimit) || calorieLimit <= 0) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid calorie limit."
    });
  }

  if (minProtein === undefined || minProtein === null || minProtein === "") {
    return res.status(400).json({
      success: false,
      message: "Please enter a minimum protein value."
    });
  }

  const proteinMinimum = Number(minProtein);
  if (!Number.isFinite(proteinMinimum) || proteinMinimum < 0) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid minimum protein value."
    });
  }

  const recommendations = recommendFoods(goal, calorieLimit, proteinMinimum);

  const response = {
    success: true,
    count: recommendations.length,
    foods: recommendations
  };

  if (recommendations.length === 0) {
    response.message = "No exact food match found for these nutrition requirements.";
  }

  return res.status(200).json(response);
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({
      success: false,
      message: "The request contains invalid JSON."
    });
  }

  console.error("Unexpected server error:", error.message);
  return res.status(500).json({
    success: false,
    message: "Unable to process the request right now."
  });
});

app.listen(PORT, () => {
  console.log(`NutriPick is running at http://localhost:${PORT}`);
});
