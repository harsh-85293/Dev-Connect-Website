/**
 * ML-based User Recommendation System
 * Uses cosine similarity, Jaccard similarity, and skill clustering
 * to recommend users with similar or complementary skill sets
 */

// Predefined skill categories and weights for better recommendations
const SKILL_CATEGORIES = {
  frontend: {
    skills: ['react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css', 'tailwind', 'bootstrap', 'sass', 'next.js', 'nuxt.js'],
    weight: 1.2
  },
  backend: {
    skills: ['node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'fastapi', 'nest.js', 'koa', 'ruby on rails'],
    weight: 1.2
  },
  database: {
    skills: ['mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'cassandra', 'dynamodb', 'firebase'],
    weight: 1.1
  },
  cloud: {
    skills: ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'heroku', 'vercel', 'netlify', 'digitalocean'],
    weight: 1.3
  },
  mobile: {
    skills: ['react native', 'flutter', 'swift', 'kotlin', 'ionic', 'xamarin', 'cordova'],
    weight: 1.2
  },
  devops: {
    skills: ['docker', 'kubernetes', 'jenkins', 'gitlab ci', 'github actions', 'terraform', 'ansible', 'chef', 'puppet'],
    weight: 1.1
  },
  languages: {
    skills: ['javascript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'typescript'],
    weight: 1.0
  },
  aiml: {
    skills: ['machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy', 'opencv'],
    weight: 1.4
  }
};

// Skill relationship graph for complementary skills
const SKILL_RELATIONSHIPS = {
  'react': ['node.js', 'express', 'mongodb', 'typescript', 'next.js'],
  'vue': ['node.js', 'express', 'mongodb', 'typescript', 'nuxt.js'],
  'angular': ['node.js', 'express', 'typescript', 'rxjs'],
  'node.js': ['express', 'mongodb', 'postgresql', 'redis', 'aws'],
  'python': ['django', 'flask', 'postgresql', 'mongodb', 'machine learning'],
  'java': ['spring', 'postgresql', 'mysql', 'aws', 'kubernetes'],
  'docker': ['kubernetes', 'aws', 'node.js', 'python', 'java'],
  'aws': ['docker', 'kubernetes', 'node.js', 'python', 'terraform']
};

/**
 * Normalize skill names for consistent matching
 */
const normalizeSkill = (skill) => {
  return skill.toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s.#+-]/g, '');
};

/**
 * Get skill category and weight
 */
const getSkillCategory = (skill) => {
  const normalizedSkill = normalizeSkill(skill);
  
  for (const [category, data] of Object.entries(SKILL_CATEGORIES)) {
    if (data.skills.includes(normalizedSkill)) {
      return { category, weight: data.weight };
    }
  }
  
  return { category: 'other', weight: 1.0 };
};

/**
 * Calculate Jaccard similarity between two skill sets
 */
const calculateJaccardSimilarity = (skillsA, skillsB) => {
  if (!skillsA || !skillsB || skillsA.length === 0 || skillsB.length === 0) {
    return 0;
  }

  const setA = new Set(skillsA.map(normalizeSkill));
  const setB = new Set(skillsB.map(normalizeSkill));
  
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  
  return intersection.size / union.size;
};

/**
 * Calculate cosine similarity using skill vectors
 */
const calculateCosineSimilarity = (skillsA, skillsB) => {
  if (!skillsA || !skillsB || skillsA.length === 0 || skillsB.length === 0) {
    return 0;
  }

  // Create skill universe
  const allSkills = [...new Set([
    ...skillsA.map(normalizeSkill),
    ...skillsB.map(normalizeSkill)
  ])];

  // Create weighted vectors
  const vectorA = allSkills.map(skill => {
    const hasSkill = skillsA.map(normalizeSkill).includes(skill);
    const { weight } = getSkillCategory(skill);
    return hasSkill ? weight : 0;
  });

  const vectorB = allSkills.map(skill => {
    const hasSkill = skillsB.map(normalizeSkill).includes(skill);
    const { weight } = getSkillCategory(skill);
    return hasSkill ? weight : 0;
  });

  // Calculate cosine similarity
  const dotProduct = vectorA.reduce((sum, a, i) => sum + a * vectorB[i], 0);
  const magnitudeA = Math.sqrt(vectorA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vectorB.reduce((sum, b) => sum + b * b, 0));

  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  
  return dotProduct / (magnitudeA * magnitudeB);
};

/**
 * Calculate complementary skill score
 */
const calculateComplementaryScore = (userSkills, targetSkills) => {
  if (!userSkills || !targetSkills) return 0;

  const userNormalized = userSkills.map(normalizeSkill);
  const targetNormalized = targetSkills.map(normalizeSkill);
  
  let complementaryScore = 0;
  let totalRelationships = 0;

  userNormalized.forEach(userSkill => {
    const relationships = SKILL_RELATIONSHIPS[userSkill] || [];
    totalRelationships += relationships.length;
    
    relationships.forEach(relatedSkill => {
      if (targetNormalized.includes(relatedSkill)) {
        complementaryScore += 1;
      }
    });
  });

  return totalRelationships > 0 ? complementaryScore / totalRelationships : 0;
};

/**
 * Calculate skill diversity score
 */
const calculateDiversityScore = (skills) => {
  if (!skills || skills.length === 0) return 0;

  const categories = new Set();
  skills.forEach(skill => {
    const { category } = getSkillCategory(skill);
    categories.add(category);
  });

  // Reward diversity - more categories = higher score
  return Math.min(categories.size / Object.keys(SKILL_CATEGORIES).length, 1);
};

/**
 * Calculate experience level similarity
 */
const calculateExperienceScore = (userA, userB) => {
  if (!userA.skills || !userB.skills) return 0;

  const skillCountA = userA.skills.length;
  const skillCountB = userB.skills.length;
  
  // Calculate age-based experience proxy
  const ageA = userA.age || 25;
  const ageB = userB.age || 25;
  
  const experienceA = skillCountA * Math.log(Math.max(ageA - 18, 1) + 1);
  const experienceB = skillCountB * Math.log(Math.max(ageB - 18, 1) + 1);
  
  const maxExperience = Math.max(experienceA, experienceB);
  const minExperience = Math.min(experienceA, experienceB);
  
  return maxExperience > 0 ? minExperience / maxExperience : 0;
};

/**
 * Generate human-readable reasoning for recommendations
 */
const generateRecommendationReasoning = (currentUser, targetUser, scores) => {
  const reasons = [];
  
  if (scores.jaccard > 0.3) {
    const commonSkills = currentUser.skills?.filter(skill => 
      targetUser.skills?.map(normalizeSkill).includes(normalizeSkill(skill))
    ) || [];
    reasons.push(`You share ${commonSkills.length} common skills: ${commonSkills.slice(0, 3).join(', ')}`);
  }
  
  if (scores.complementary > 0.2) {
    reasons.push("Your skills complement each other well for collaboration");
  }
  
  if (scores.diversity > 0.6) {
    reasons.push("They have diverse skills across multiple domains");
  }
  
  if (scores.experience > 0.7) {
    reasons.push("Similar experience level for peer learning");
  }
  
  return reasons.length > 0 ? reasons : ["Potential for interesting professional connection"];
};

/**
 * Main ML recommendation algorithm
 */
const calculateRecommendationScore = (currentUser, targetUser, options = {}) => {
  const {
    jaccardWeight = 0.3,
    cosineWeight = 0.25,
    complementaryWeight = 0.2,
    diversityWeight = 0.15,
    experienceWeight = 0.1
  } = options;

  // Calculate individual scores
  const jaccardScore = calculateJaccardSimilarity(currentUser.skills, targetUser.skills);
  const cosineScore = calculateCosineSimilarity(currentUser.skills, targetUser.skills);
  const complementaryScore = calculateComplementaryScore(currentUser.skills, targetUser.skills);
  const diversityScore = calculateDiversityScore(targetUser.skills);
  const experienceScore = calculateExperienceScore(currentUser, targetUser);

  // Calculate weighted final score
  const finalScore = (
    jaccardScore * jaccardWeight +
    cosineScore * cosineWeight +
    complementaryScore * complementaryWeight +
    diversityScore * diversityWeight +
    experienceScore * experienceWeight
  );

  return {
    finalScore: Math.min(finalScore, 1), // Cap at 1.0
    breakdown: {
      jaccard: jaccardScore,
      cosine: cosineScore,
      complementary: complementaryScore,
      diversity: diversityScore,
      experience: experienceScore
    },
    reasoning: generateRecommendationReasoning(currentUser, targetUser, {
      jaccardScore,
      cosineScore,
      complementaryScore,
      diversityScore,
      experienceScore
    })
  };
};

/**
 * Rank and filter users based on ML recommendations
 */
const rankUsersByRecommendation = (currentUser, users, options = {}) => {
  const { 
    minScore = 0.1, 
    maxResults = 50,
    includeBreakdown = false 
  } = options;

  if (!currentUser || !users || users.length === 0) {
    return [];
  }

  console.log(`🤖 ML: Processing ${users.length} users for recommendations`);

  // Calculate scores for all users
  const scoredUsers = users
    .filter(user => user._id.toString() !== currentUser._id.toString()) // Exclude self
    .map(user => {
      const recommendation = calculateRecommendationScore(currentUser, user);
      return {
        ...user._doc || user, // Handle Mongoose document
        recommendationScore: recommendation.finalScore,
        recommendationReasoning: recommendation.reasoning,
        ...(includeBreakdown && { scoreBreakdown: recommendation.breakdown })
      };
    })
    .filter(user => user.recommendationScore >= minScore)
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, maxResults);

  console.log(`🤖 ML: Returning ${scoredUsers.length} recommended users`);
  return scoredUsers;
};

/**
 * Get skill-based clusters
 */
const getSkillClusters = (users) => {
  const clusters = {};
  
  users.forEach(user => {
    if (!user.skills) return;
    
    user.skills.forEach(skill => {
      const { category } = getSkillCategory(skill);
      if (!clusters[category]) {
        clusters[category] = [];
      }
      clusters[category].push(user);
    });
  });
  
  return clusters;
};

/**
 * Get trending skills analysis
 */
const getTrendingSkills = (users) => {
  const skillCount = {};
  const totalUsers = users.length;
  
  users.forEach(user => {
    if (!user.skills) return;
    
    user.skills.forEach(skill => {
      const normalized = normalizeSkill(skill);
      skillCount[normalized] = (skillCount[normalized] || 0) + 1;
    });
  });
  
  return Object.entries(skillCount)
    .map(([skill, count]) => ({
      skill,
      count,
      percentage: ((count / totalUsers) * 100).toFixed(1),
      category: getSkillCategory(skill).category
    }))
    .sort((a, b) => b.count - a.count);
};

module.exports = {
  calculateRecommendationScore,
  rankUsersByRecommendation,
  getSkillClusters,
  getTrendingSkills,
  calculateJaccardSimilarity,
  calculateCosineSimilarity,
  normalizeSkill
};
