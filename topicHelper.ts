const quizTopics: string[] = [
    "History", "Sports", "Animals", "Science", "Geography", "Movies", "Music", "Literature", "Art", "Technology",
    "Physics", "Chemistry", "Biology", "Mathematics", "Astronomy", "Philosophy", "Psychology", "Sociology", "Economics", "Politics",
    "World Wars", "Classical Music", "Jazz", "Rock Music", "Pop Music", "Cinema Classics", "Modern Movies", "Acting", "Directing", "Screenwriting",
    "Painting", "Sculpture", "Architecture", "Photography", "Contemporary Art", "Ancient Civilizations", "Medieval History", "Renaissance", "Industrial Revolution", "Modern History",
    "American History", "European History", "Asian History", "African History", "Latin American History", "Middle Eastern History", "Australian History", "Canadian History", "Russian History", "Indian History",
    "World Capitals", "Countries", "Oceans and Seas", "Mountains", "Rivers", "Deserts", "Islands", "Lakes", "Biodiversity", "Environmental Science",
    "Human Anatomy", "Genetics", "Neuroscience", "Botany", "Zoology", "Microbiology", "Paleontology", "Quantum Mechanics", "Relativity", "Thermodynamics",
    "Algebra", "Geometry", "Calculus", "Statistics", "Logic", "Theoretical Computer Science", "Operating Systems", "Programming Languages", "Databases", "Network Security",
    "Nutrition", "Culinary Arts", "Fashion", "Travel", "Languages", "Religions", "Mythology", "Sports History", "Olympic Games", "Fitness"
];

export default function(): string[] {
    let result: string[] = [];
    let indicesChosen: Set<number> = new Set();

    while (indicesChosen.size < 5) {
        let randomIndex = Math.floor(Math.random() * quizTopics.length);
        if (!indicesChosen.has(randomIndex)) {
            indicesChosen.add(randomIndex);
            result.push(quizTopics[randomIndex]);
        }
    }
    return result;
}
