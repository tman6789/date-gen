
export const VIBES = [
    { id: "romantic", label: "Romantic", icon: "💕" },
    { id: "food", label: "Food", icon: "🍽️" },
    { id: "adventure", label: "Adventure", icon: "🧗" },
    { id: "cozy", label: "Cozy", icon: "☕" },
    { id: "active", label: "Active", icon: "🚴" },
    { id: "arts", label: "Arts & Culture", icon: "🎨" },
    { id: "nightout", label: "Night Out", icon: "🌙" },
    { id: "chill", label: "Chill", icon: "😌" },
    { id: "surprise", label: "Surprise Me", icon: "🎲" },
];

export const BUDGETS = ["$", "$$", "$$$"];
export const TIMES = ["Short (~1hr)", "Evening (2-3hr)", "Half-day (4-5hr)", "Full day"];
export const SETTINGS = ["Indoor", "Outdoor", "Either"];
export const TRANSPORT = ["Walk/Metro", "Car", "Either"];

export const SEASONS = (() => {
    const m = new Date().getMonth();
    if (m >= 2 && m <= 4) return "spring";
    if (m >= 5 && m <= 7) return "summer";
    if (m >= 8 && m <= 10) return "fall";
    return "winter";
})();

export const TIME_OF_DAY = (() => {
    const h = new Date().getHours();
    if (h < 11) return "morning";
    if (h < 14) return "midday";
    if (h < 17) return "afternoon";
    if (h < 20) return "evening";
    return "night";
})();
