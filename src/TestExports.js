// 🧪 FICHIER DE TEST - Exports non utilisés
console.log("Test exports ESLint");

// ❌ Exports non utilisés - DEVRAIENT être détectés par unimported
export const UNUSED_CONSTANT = "Je ne suis pas utilisée";
export const ANOTHER_UNUSED = 42;

// ❌ Fonction exportée non utilisée - DEVRAIT être détectée
export const unusedFunction = () => {
    return "Fonction non utilisée";
};

// ❌ Export temporaire ignoré par commentaire
// eslint-disable-next-line import/no-unused-modules
export const TEMP_UNUSED_CONFIG = {
    setting1: "value1",
    setting2: "value2"
};

// ✅ Export utilisé quelque part - ne devrait PAS être souligné
export const USED_CONSTANT = "Je suis utilisée";

// Export par défaut pour éviter l'erreur
export default {
    USED_CONSTANT
};
