const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json'); // Replace with the path to your service account key file

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const resources = [
    {
        "title": "TED Talk: '6 Tips for Better Sleep'",
        "description": "A video on how environmental factors like lighting and room temperature affect sleep quality (TED)",
        "link": "https://www.youtube.com/watch?v=t0kACis_dJE",
        "icon": "video_library",
        "category": "Sleep"
    },
    {
        "title": "Harvard Health's Sleep Strategies",
        "description": "Tips for setting a routine, minimizing alcohol, and managing stress to enhance sleep",
        "link": "https://www.health.harvard.edu/blog/strategies-to-promote-better-sleep-in-these-uncertain-times-2020032719333",
        "icon": "self_improvement",
        "category": "Sleep"
    },
    {
        "title": "'How to Sleep Better' by Harvard Health",
        "description": "A deep dive into behavioral therapies like CBT for insomnia and medication options",
        "link": "https://www.health.harvard.edu/topics/sleep",
        "icon": "menu_book",
        "category": "Sleep"
    },
    {
        "title": "'20 Tips to Sleep Better' from the Sleep Foundation",
        "description": "Practical advice on consistent wake times, napping strategies, and bedtime relaxation techniques",
        "link": "https://www.sleepfoundation.org/sleep-hygiene/healthy-sleep-tips",
        "icon": "lightbulb",
        "category": "Sleep"
    },
    {
        "title": "'Understanding Sleep Cycles' from MindBodyGreen",
        "description": "Details on optimizing sleep cycles to improve mental and physical health",
        "link": "https://www.mindbodygreen.com/articles/sleep-cycles-explainer-how-to-optimize-yours",
        "icon": "hourglass_empty",
        "category": "Sleep"
    },
    {
        "title": "NIH's Guide: 'Good Sleep for Good Health'",
        "description": "Focuses on maintaining a sleep diary and using CPAP machines for sleep apnea patients",
        "link": "https://newsinhealth.nih.gov/2021/04/good-sleep-good-health",
        "icon": "health_and_safety",
        "category": "Sleep"
    },
    {
        "title": "'Matthew Walker’s 11 Sleep Tips'",
        "description": "Tips from a leading sleep scientist on how sleep loss affects daily life and health",
        "link": "https://www.masterclass.com/articles/matthew-walker-on-improving-sleep-quality",
        "icon": "science",
        "category": "Sleep"
    },
    {
        "title": "'What Happens During Sleep Cycles' by the Sleep Foundation",
        "description": "An explanation of the different stages of sleep and their roles in restoration",
        "link": "https://www.sleepfoundation.org/stages-of-sleep",
        "icon": "explore",
        "category": "Sleep"
    },
    {
        "title": "'How Much Sleep You Need and the Four Sleep Stages' from Cleveland Clinic",
        "description": "A breakdown of NREM and REM stages with tips for optimizing rest",
        "link": "https://health.clevelandclinic.org/your-complete-guide-to-sleep",
        "icon": "schedule",
        "category": "Sleep"
    },
    {
        "title": "'15 Proven Ways to Sleep Better' from SleepJunkie",
        "description": "Advice on controlling bedroom environments and limiting screen time before bed",
        "link": "https://www.sleepjunkie.com/how-to-sleep-better/",
        "icon": "bed",
        "category": "Sleep"
    },
    {
        "title": "'12 Sleep Hygiene Tips' by Verywell Health",
        "description": "Includes the 10-3-2-1 rule for managing caffeine, alcohol, and electronics use",
        "link": "https://www.verywellhealth.com/sleep-hygiene-8717173",
        "icon": "cleaning_services",
        "category": "Sleep"
    },
    {
        "title": "'How to Build a Better Bedtime Routine' from the Sleep Foundation",
        "description": "Explores the benefits of meditation and white noise for sleep quality",
        "link": "https://www.sleepfoundation.org/sleep-hygiene/bedtime-routine-for-adults",
        "icon": "night_shelter",
        "category": "Sleep"
    },
    {
        "title": "'15 Science-Backed Tips for Better Sleep' from Healthline",
        "description": "Recommendations for optimizing mattresses, sleepwear, and bedding to enhance sleep",
        "link": "https://www.healthline.com/nutrition/17-tips-to-sleep-better",
        "icon": "local_hotel",
        "category": "Sleep"
    },
    {
        "title": "BBC’s 'Seven Ways to Improve Your Sleep'",
        "description": "Discusses aligning sleep patterns with circadian rhythms for optimal rest",
        "link": "https://www.sleepfoundation.org/sleep-hygiene/healthy-sleep-tips",
        "icon": "trending_up",
        "category": "Sleep"
    },
    {
        "title": "'Strategies for Better Sleep in Uncertain Times' by Harvard Health",
        "description": "Emphasizes stress management and relaxation techniques",
        "link": "https://www.health.harvard.edu/blog/strategies-to-promote-better-sleep-in-these-uncertain-times-2020032719333",
        "icon": "spa",
        "category": "Sleep"
    },
    {
        "title": "MasterClass - '7 Ways to Manage Stress'",
        "description": "Offers practical tips, such as deep breathing exercises and building a sleep routine, to reduce stress effectively",
        "link": "https://www.masterclass.com/articles/how-to-manage-stress",
        "icon": "self_improvement",
        "category": "Stress"
    },
    {
        "title": "American Heart Association - Stress Management Tips",
        "description": "Explains the connection between stress, heart health, and well-being, with strategies to improve mental and physical health",
        "link": "https://www.heart.org/en/healthy-living/healthy-lifestyle/stress-management",
        "icon": "favorite",
        "category": "Stress"
    },
    {
        "title": "Workplace Strategies for Mental Health - Relaxation Videos",
        "description": "Includes a series of videos teaching relaxation techniques, such as mindfulness exercises and deep conscious sleep practices",
        "link": "https://www.workplacestrategiesformentalhealth.com/resources/stress-reduction-videos",
        "icon": "ondemand_video",
        "category": "Stress"
    },
    {
        "title": "YouTube - '12 Easy Steps to Resolve Stress'",
        "description": "A step-by-step video explaining practical methods to cope with stress in everyday life",
        "link": "https://www.youtube.com/watch?v=cL5GXQMkjMU",
        "icon": "movie",
        "category": "Stress"
    },
    {
        "title": "Psychreg - Mental Health Tips for 2024",
        "description": "Covers lifestyle changes like mindfulness practices, outdoor activities, and digital detoxes to enhance resilience against stress",
        "link": "https://www.psychreg.org/tips-better-mental-health-2024/",
        "icon": "wb_sunny",
        "category": "Stress"
    },
    {
        "title": "Harvard Relaxation Response - Stress Management Sessions",
        "description": "An instructional video detailing breathing practices that activate the body's relaxation response",
        "link": "https://www.workplacestrategiesformentalhealth.com/resources/stress-reduction-videos",
        "icon": "favorite_border",
        "category": "Stress"
    },
    {
        "title": "American Psychological Association - Managing Stress Tools",
        "description": "Offers various psychological tools for stress management, including mindfulness and meditation practices",
        "link": "https://www.apa.org/topics/mindfulness/meditation",
        "icon": "psychology",
        "category": "Stress"
    },
    {
        "title": "Karamo Brown's Stress Management Insights",
        "description": "Part of a series by the American Heart Association featuring personal stories on coping with stress",
        "link": "https://www.heart.org/en/healthy-living/healthy-lifestyle/stress-management",
        "icon": "person",
        "category": "Stress"
    },
    {
        "title": "University Health Network - Deep Conscious Sleep Practice",
        "description": "A guided relaxation video designed to improve sleep quality and reduce stress",
        "link": "https://www.workplacestrategiesformentalhealth.com/resources/stress-reduction-videos",
        "icon": "hotel",
        "category": "Stress"
    },
    {
        "title": "Amber Riley’s Journey with Chronic Stress",
        "description": "A video discussing how the actress manages chronic stress, sharing valuable self-care tips",
        "link": "https://www.heart.org/en/healthy-living/healthy-lifestyle/stress-management",
        "icon": "movie_creation",
        "category": "Stress"
    },
    {
        "title": "Mindfulness-Based Stress Reduction (MBSR) Programs",
        "description": "Detailed guide from the APA, showing how MBSR techniques can help in stressful situations",
        "link": "https://www.apa.org/topics/stress/manage-stress-tools",
        "icon": "mediation",
        "category": "Stress"
    },
    {
        "title": "Melissa Fumero's Stress Management Routine",
        "description": "Part of the American Heart Association series, focusing on self-care and stress coping mechanisms",
        "link": "https://www.heart.org/en/healthy-living/healthy-lifestyle/stress-management",
        "icon": "face_retouching_natural",
        "category": "Stress"
    },
    {
        "title": "Workplace Mental Health Strategies",
        "description": "Describes how mindfulness practices and structured wellness programs can improve mental well-being at work",
        "link": "https://www.workplacestrategiesformentalhealth.com/resources/stress-reduction-videos",
        "icon": "work",
        "category": "Stress"
    },
    {
        "title": "Yoga and Breathing Exercises for Mental Health",
        "description": "A MasterClass article detailing the benefits of pranayama (yogic breathing) for managing stress",
        "link": "https://www.masterclass.com/articles/how-to-manage-stress",
        "icon": "emoji_people",
        "category": "Stress"
    },
    {
        "title": "CDC: Physical Activity Basics",
        "description": "Overview of how physical activity helps prevent chronic disease, maintain muscle strength, and improve longevity.",
        "link": "https://www.cdc.gov/physicalactivity/basics/index.htm",
        "icon": "fitness_center",
        "category": "Activity"
    },
    {
        "title": "Harvard Health: Benefits & Recommended Types of Exercise",
        "description": "This article discusses the importance of exercise for cardiovascular health, mental well-being, and maintaining physical fitness.",
        "link": "https://www.health.harvard.edu/topics/exercise-and-fitness",
        "icon": "health_and_safety",
        "category": "Activity"
    },
    {
        "title": "American Heart Association: Why Physical Activity Matters",
        "description": "Covers how exercise improves mood, reduces health risks, and promotes better sleep.",
        "link": "https://www.heart.org/en/healthy-living/fitness/fitness-basics/why-is-physical-activity-so-important-for-health-and-wellbeing",
        "icon": "favorite",
        "category": "Activity"
    },
    {
        "title": "Verywell Health: 12 Benefits of Regular Exercise",
        "description": "A research-backed article that details how exercise can prevent chronic diseases and improve heart health.",
        "link": "https://www.verywellhealth.com/benefits-of-exercise-8704494",
        "icon": "medical_services",
        "category": "Activity"
    },
    {
        "title": "Healthline: Top 10 Benefits of Physical Activity",
        "description": "An article that explains how exercise contributes to better sleep, reduces pain, and supports mental health.",
        "link": "https://www.healthline.com/nutrition/10-benefits-of-exercise",
        "icon": "emoji_people",
        "category": "Activity"
    },
    {
        "title": "Medical News Today: Exercise for Physical and Mental Health",
        "description": "Discusses how exercise helps manage weight, chronic pain, and mental well-being.",
        "link": "https://www.medicalnewstoday.com/articles/benefits-of-exercise",
        "icon": "psychology",
        "category": "Activity"
    },
    {
        "title": "Mayo Clinic Minute: 6 Tips to Stay Motivated for Exercise",
        "description": "A short video with practical advice for maintaining motivation to work out.",
        "link": "https://newsnetwork.mayoclinic.org/discussion/mayo-clinic-minute-6-tips-to-keep-you-motivated-for-exercise/",
        "icon": "ondemand_video",
        "category": "Activity"
    },
    {
        "title": "Stanford Longevity Project: How to Stay Motivated to Exercise",
        "description": "Offers tips on choosing enjoyable activities and how small changes can have lasting health benefits.",
        "link": "https://longevity.stanford.edu/lifestyle/2024/01/11/3-ways-to-get-and-stay-motivated-to-exercise/",
        "icon": "hourglass_top",
        "category": "Activity"
    },
    {
        "title": "Fitness Blender: Increasing Motivation for Exercise",
        "description": "This article leverages psychological theories to explain how to stay motivated and overcome fitness barriers.",
        "link": "https://www.fitnessblender.com/articles/understanding-how-to-increase-your-motivation-to-exercise",
        "icon": "psychology",
        "category": "Activity"
    },
    {
        "title": "WHO: Global Physical Activity Guidelines",
        "description": "Provides guidelines on recommended activity levels for various age groups to maintain optimal health.",
        "link": "https://www.who.int/news-room/fact-sheets/detail/physical-activity",
        "icon": "public",
        "category": "Activity"
    },
    {
        "title": "Mayo Clinic: Meditation for Stress Relief",
        "description": "Learn about the different types of meditation and how to incorporate them into your daily routine to reduce stress and improve mood.",
        "link": "https://www.mayoclinic.org/tests-procedures/meditation/in-depth/meditation/art-20045858",
        "icon": "self_improvement",
        "category": "Stress"
    },
    {
        "title": "Mayo Clinic: Stress Relievers and Mental Wellness Tips",
        "description": "Offers practical strategies for managing stress and enhancing emotional health, including yoga, music, and journaling.",
        "link": "https://www.mayoclinic.org/healthy-lifestyle/stress-management/in-depth/stress-relievers/art-20047257",
        "icon": "spa",
        "category": "Stress"
    },
    {
        "title": "Mayo Clinic: Positive Thinking and Self-Talk",
        "description": "Focuses on how shifting negative thoughts into positive ones can improve mental resilience and overall well-being.",
        "link": "https://www.mayoclinic.org/healthy-lifestyle/stress-management/in-depth/positive-thinking/art-20043950",
        "icon": "psychology",
        "category": "Stress"
    },
    {
        "title": "Mayo Clinic Health System: Embracing Joy Daily",
        "description": "This article discusses the difference between joy and happiness, with tips on how to cultivate joy in daily life.",
        "link": "https://www.mayoclinichealthsystem.org/hometown-health/speaking-of-health/tips-for-embracing-joy-in-daily-life",
        "icon": "emoji_emotions",
        "category": "Stress"
    },
    {
        "title": "Mayo Clinic: Managing Emotional Intelligence through Mindfulness",
        "description": "Learn how mindfulness can improve emotional intelligence, helping you manage emotions and cope better with challenges.",
        "link": "https://connect.mayoclinic.org/blog/mindfulness-in-coping-with-chronic-conditions/",
        "icon": "lightbulb",
        "category": "Stress"
    },
    {
        "title": "TED Talk: Susan David on Emotional Agility",
        "description": "In this insightful video, Susan David discusses how embracing all emotions, including challenging ones, leads to greater emotional well-being.",
        "link": "https://www.ted.com/talks/susan_david_the_gift_and_power_of_emotional_courage?language=en",
        "icon": "ondemand_video",
        "category": "Stress"
    },
    {
        "title": "Mayo Clinic: Self-Care for Mental Health",
        "description": "Covers self-care practices to manage anxiety and depression, emphasizing the importance of routine and mindfulness.",
        "link": "https://newsnetwork.mayoclinic.org/discussion/self-care-tips-to-manage-mental-health-and-wellness/",
        "icon": "favorite",
        "category": "Stress"
    },
    {
        "title": "Mayo Clinic: The Health Benefits of Yoga",
        "description": "Learn how yoga can help reduce stress, improve mood, and enhance overall well-being through physical and mental balance.",
        "link": "https://www.mayoclinic.org/healthy-lifestyle/stress-management/in-depth/stress-management/art-20044257",
        "icon": "self_improvement",
        "category": "Stress"
    },
    {
        "title": "Mayo Clinic: Stress Basics and Management Strategies",
        "description": "This article explains what stress is and offers actionable tips to prevent it from affecting your emotional health.",
        "link": "https://www.mayoclinic.org/healthy-lifestyle/stress-management/in-depth/stress-management/art-20044257",
        "icon": "explore",
        "category": "Stress"
    },
    {
        "title": "Mayo Clinic: Sleep and Mood Management",
        "description": "Highlights the relationship between sleep quality and emotional well-being, offering advice for better sleep hygiene.",
        "link": "https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/sleep/art-20045432",
        "icon": "hotel",
        "category": "Stress"
    },
    {
        "title": "Verywell Mind: Best Exercises for Lifting Mood",
        "description": "Explores which physical activities are most effective for boosting mood and relieving symptoms of depression and anxiety.",
        "link": "https://www.verywellmind.com/exercise-and-improving-your-mood-2223781",
        "icon": "fitness_center",
        "category": "Stress"
    },
    {
        "title": "Mayo Clinic: Journaling for Emotional Health",
        "description": "Discusses how journaling can release pent-up emotions and help process stress more effectively.",
        "link": "https://www.mayoclinic.org/healthy-lifestyle/stress-management/in-depth/stress-relievers/art-20047257",
        "icon": "edit",
        "category": "Stress"
    },
    {
        "title": "Mayo Clinic: Benefits of Laughter and Humor for Stress Management",
        "description": "Find out how humor can enhance emotional well-being and serve as a natural stress reliever.",
        "link": "https://www.mayoclinic.org/healthy-lifestyle/stress-management/in-depth/laughter-is-the-best-medicine/art-20044456",
        "icon": "sentiment_very_satisfied",
        "category": "Stress"
    },
    {
        "title": "Healthy UC Davis: Mood Tracking and Emotional Awareness",
        "description": "Learn how tracking your mood and emotions can uncover patterns and help you manage mental health proactively.",
        "link": "https://healthy.ucdavis.edu/mental-emotional/resource-library/general/moods",
        "icon": "insights",
        "category": "Stress"
    }

];

async function populateResources() {
    const batch = db.batch();

    resources.forEach(resource => {
        const docRef = db.collection('recommendedresources').doc();
        batch.set(docRef, resource);
    });

    await batch.commit();
    console.log('Recommended resources have been successfully added to Firebase!');
}

populateResources().catch(error => {
    console.error("Error adding resources: ", error);
});
