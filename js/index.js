// Mobile Menu Toggle
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Subscribe Form Handling
const subscribeForm = document.querySelector('.subscribe-form');
subscribeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input').value;
    alert(`Thank you for subscribing with email: ${email}`);
    e.target.reset();
});

// Initialize on page load
const foodData = {
    healthy: {
        "Dal Tadka": { protein: 8, carbs: 15, goodFat: 2, badFat: 0, energy: 180, vitamins: 2, sodium: 10 },
        "Palak Paneer": { protein: 10, carbs: 12, goodFat: 8, badFat: 1, energy: 200, vitamins: 4, sodium: 20 },
        Roti: { protein: 3, carbs: 20, goodFat: 1, badFat: 0, energy: 120, vitamins: 1, sodium: 5 },
        "Tandoori Chicken": { protein: 25, carbs: 5, goodFat: 6, badFat: 1, energy: 250, vitamins: 3, sodium: 15 },
        Eggs: { protein: 13, carbs: 1, goodFat: 5, badFat: 1, energy: 155, vitamins: 3, sodium: 70 },
        Idli: { protein: 6, carbs: 20, goodFat: 1, badFat: 0, energy: 120, vitamins: 1, sodium: 2 },
        Dosa: { protein: 7, carbs: 25, goodFat: 2, badFat: 1, energy: 150, vitamins: 1, sodium: 5 },
        Fruits: { protein: 1, carbs: 18, goodFat: 0, badFat: 0, energy: 80, vitamins: 5, sodium: 1 }
    },
    unhealthy: {
        Pizza: { protein: 12, carbs: 35, goodFat: 6, badFat: 10, energy: 300, vitamins: 1, sodium: 100 },
        Burger: { protein: 10, carbs: 40, goodFat: 8, badFat: 15, energy: 500, vitamins: 1, sodium: 150 },
        "Butter Naan": { protein: 5, carbs: 35, goodFat: 4, badFat: 6, energy: 320, vitamins: 1, sodium: 50 },
        "French Fries": { protein: 3, carbs: 50, goodFat: 0, badFat: 20, energy: 400, vitamins: 0, sodium: 200 },
        Jalebi: { protein: 1, carbs: 45, goodFat: 0, badFat: 12, energy: 450, vitamins: 0, sodium: 10 },
        Samosa: { protein: 4, carbs: 30, goodFat: 1, badFat: 10, energy: 300, vitamins: 0, sodium: 40 },
        "Pav Bhaji": { protein: 6, carbs: 40, goodFat: 3, badFat: 8, energy: 350, vitamins: 1, sodium: 60 },
        Noodles: { protein: 7, carbs: 50, goodFat: 2, badFat: 5, energy: 350, vitamins: 0, sodium: 120 }
    }
};

// Attribute units
const units = {
    protein: "g",
    carbs: "g",
    goodFat: "g",
    badFat: "g",
    energy: "kcal",
    vitamins: "",
    sodium: "mg"
};

let selectedHealthy = null;
let selectedUnhealthy = null;

function selectFood(cell, type) {
    // Clear previous selection for the same type (healthy or unhealthy)
    const tableCells = document.querySelectorAll(`td.${type}`);
    tableCells.forEach(td => td.classList.remove("selected"));

    // Highlight the newly selected cell
    cell.classList.add("selected");

    // Set the selected food based on type
    if (type === "healthy") {
        selectedHealthy = cell.textContent;
    } else {
        selectedUnhealthy = cell.textContent;
    }
}

function fight() {
    document.querySelectorAll("td").forEach(td => td.classList.remove("selected"));
    // Ensure both selections are made
    if (!selectedHealthy || !selectedUnhealthy) {
        alert("Please select one healthy food and one unhealthy food!");
        return;
    }

    const healthyData = foodData.healthy[selectedHealthy];
    const unhealthyData = foodData.unhealthy[selectedUnhealthy];
    const comparisonTable = document.querySelector("#comparisonTable tbody");
    const comparisonHeader = document.querySelector("#comparisonTable thead");
    comparisonTable.innerHTML = "";

    // Update the comparison table heading with selected dish names
    comparisonHeader.innerHTML = `
<tr>
    <th>Attribute</th>
    <th>${selectedHealthy}</th>
    <th>${selectedUnhealthy}</th>
</tr>
`;

    let healthyWins = 0;
    let unhealthyWins = 0;

    for (const attribute in healthyData) {
        const row = document.createElement("tr");
        const attributeCell = document.createElement("td");
        const healthyCell = document.createElement("td");
        const unhealthyCell = document.createElement("td");


        attributeCell.textContent = attribute === "vitamins"
            ? attribute
            : `${attribute} (${units[attribute]})`;

        healthyCell.textContent = `${healthyData[attribute]}${attribute === "vitamins" ? "" : ` ${units[attribute]}`}`;
        unhealthyCell.textContent = `${unhealthyData[attribute]}${attribute === "vitamins" ? "" : ` ${units[attribute]}`}`;

        healthyCell.textContent = `${healthyData[attribute]} ${units[attribute]}`;
        unhealthyCell.textContent = `${unhealthyData[attribute]} ${units[attribute]}`;

        const isLowerBetter = ["badFat", "carbs", "sodium"].includes(attribute);
        const healthyWinsAttribute = isLowerBetter
            ? healthyData[attribute] < unhealthyData[attribute]
            : healthyData[attribute] > unhealthyData[attribute];

        if (healthyWinsAttribute) {
            healthyWins++;
            healthyCell.classList.add("highlight-win");
            unhealthyCell.classList.add("highlight-lose");
        } else {
            unhealthyWins++;
            healthyCell.classList.add("highlight-lose");
            unhealthyCell.classList.add("highlight-win");
        }

        row.appendChild(attributeCell);
        row.appendChild(healthyCell);
        row.appendChild(unhealthyCell);
        comparisonTable.appendChild(row);
    }

    const resultText = document.getElementById("resultText");
    resultText.textContent = healthyWins > unhealthyWins
        ? `!! -- ${selectedHealthy} Wins -- !!`
        : `!! -- ${selectedUnhealthy} Wins -- !!`;

    const comparisonContainer = document.getElementById("comparisonContainer");
    comparisonContainer.style.display = "block";

    // Scroll to show the result table heading below the nav bar
    const navBarHeight = document.querySelector("nav")?.offsetHeight || 0;
    const scrollPosition = comparisonContainer.getBoundingClientRect().top + window.scrollY - navBarHeight;
    window.scrollTo({ top: scrollPosition, behavior: "smooth" });
}
