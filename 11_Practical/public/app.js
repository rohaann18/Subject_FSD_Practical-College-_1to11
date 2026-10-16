const form = document.querySelector("#nutrition-form");
const goalInput = document.querySelector("#goal");
const calorieInput = document.querySelector("#max-calories");
const proteinInput = document.querySelector("#min-protein");
const submitButton = document.querySelector("#submit-button");
const formError = document.querySelector("#form-error");
const results = document.querySelector("#results");
const resultCount = document.querySelector("#result-count");

function showFormError(message) {
  formError.textContent = message;
}

function validateInputs(goal, maxCalories, minProtein) {
  if (!goal) {
    return "Please select a nutrition goal.";
  }

  if (maxCalories === "" || Number(maxCalories) <= 0) {
    return "Please enter a valid calorie limit greater than zero.";
  }

  if (minProtein === "" || Number(minProtein) < 0) {
    return "Please enter a valid minimum protein value.";
  }

  return "";
}

function setLoading(isLoading) {
  submitButton.disabled = isLoading;
  submitButton.textContent = isLoading ? "Finding Foods..." : "Recommend Foods";
  results.setAttribute("aria-busy", String(isLoading));
}

function clearResults() {
  results.replaceChildren();
  resultCount.hidden = true;
}

function createStateCard(title, message, symbol) {
  const card = document.createElement("div");
  card.className = "state-card";

  const icon = document.createElement("span");
  icon.className = "state-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = symbol;

  const heading = document.createElement("h3");
  heading.textContent = title;

  const text = document.createElement("p");
  text.textContent = message;

  card.append(icon, heading, text);
  return card;
}

function createNutritionItem(label, value) {
  const item = document.createElement("div");
  item.className = "nutrition-item";

  const labelElement = document.createElement("span");
  labelElement.textContent = label;

  const valueElement = document.createElement("strong");
  valueElement.textContent = value;

  item.append(labelElement, valueElement);
  return item;
}

function createFoodCard(food) {
  const card = document.createElement("article");
  card.className = "food-card";

  const topline = document.createElement("div");
  topline.className = "food-topline";

  const name = document.createElement("h3");
  name.textContent = food.name;

  const category = document.createElement("span");
  category.className = "category";
  category.textContent = food.category;
  topline.append(name, category);

  const description = document.createElement("p");
  description.className = "description";
  description.textContent = food.description;

  const nutrition = document.createElement("div");
  nutrition.className = "nutrition-grid";
  nutrition.append(
    createNutritionItem("Calories", `${food.calories} kcal`),
    createNutritionItem("Protein", `${food.protein} g`),
    createNutritionItem("Carbs", `${food.carbs} g`),
    createNutritionItem("Fat", `${food.fat} g`)
  );

  card.append(topline, description, nutrition);
  return card;
}

function renderFoods(foods) {
  clearResults();
  resultCount.textContent = `${foods.length} ${foods.length === 1 ? "match" : "matches"}`;
  resultCount.hidden = false;

  foods.forEach((food) => {
    results.append(createFoodCard(food));
  });
}

function renderNoResults() {
  clearResults();
  results.append(
    createStateCard(
      "No exact food match found.",
      "Try increasing the calorie limit or lowering the minimum protein requirement.",
      "!"
    )
  );
}

function renderRequestError() {
  clearResults();
  results.append(
    createStateCard(
      "Unable to load food recommendations right now.",
      "Please try again.",
      "!"
    )
  );
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const goal = goalInput.value;
  const maxCalories = calorieInput.value;
  const minProtein = proteinInput.value;
  const validationMessage = validateInputs(goal, maxCalories, minProtein);

  showFormError(validationMessage);
  if (validationMessage) {
    return;
  }

  setLoading(true);

  try {
    let data;
    if (window.location.pathname.includes("/public/")) {
      const foods = window.FoodData.recommendFoods(goal, maxCalories, minProtein);
      data = { count: foods.length, foods };
    } else {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal,
          maxCalories: Number(maxCalories),
          minProtein: Number(minProtein)
        })
      });
      data = await response.json();
      if (!response.ok) {
        showFormError(data.message || "Please check the entered values.");
        return;
      }
    }

    if (data.count === 0) {
      renderNoResults();
    } else {
      renderFoods(data.foods);
    }
  } catch (error) {
    renderRequestError();
  } finally {
    setLoading(false);
  }
});
