export const courses = [
  {
    id: "1",
    title: "React for Beginners",
    shortIntroduction:
      "Learn the basics of React.js and build dynamic web applications.",
    rating: 4.5,
    categories: ["Web Development", "Framework"],
    instructors: ["Jane Doe", "John Smith"],
    languages: "English",
    whatYouWillLearn: [
      "Understand React components and JSX",
      "Manage state and props",
      "Handle events and forms",
      "Use React Router for navigation",
    ],
    topics: ["React Basics", "State Management", "Routing"],
    requirements: ["Basic HTML, CSS, and JavaScript knowledge", "Computer"],
    description:
      "This course is designed for beginners who want to learn React.js from scratch. You will start with the fundamentals and gradually build up to more complex concepts.",
    whoIsThisCourseFor: [
      "Aspiring web developers",
      "Front-end developers looking to learn React",
    ],
    price: 49.99,
    currency: "$",
    thumbnail: "https://picsum.photos/1000/600?random=1",
    promoVideo: "https://youtu.be/Tn6-PIqc4UM?si=oC1CY_4ZFvBeGcqF",
    enrolledStudents: 1200,
    enroll: true,
    curriculum: [
      {
        chapterName: "Introduction",
        lessons: [
          {
            type: "lecture",
            subType: "video",
            title: "Welcome to the course",
            description: "lorem ipsum",
            link: "https://youtu.be/JPT3bFIwJYA?si=QSEFTCE_pFgI1vMh",
          },
          {
            type: "lecture",
            subType: "article",
            title: "Useful resources",
            description: "lorem ipsum",
            content: "React official documentation: https://react.dev/",
          },
          {
            type: "quiz",
            title: "Introduction Quiz",
            questions: [
              {
                position: 1,
                question: "What is React?",
                options: [
                  {
                    answer: "A JavaScript library for building user interfaces",
                    isTrue: true,
                  },
                  {answer: "A CSS framework", isTrue: false},
                  {answer: "A database management system", isTrue: false},
                  {answer: "A web server", isTrue: false},
                ],
              },
            ],
          },
        ],
      },
      {chapterName: "React Core Concepts"},
    ],
  },
  {
    id: "2",
    title: "Making iOS Apps with Swift",
    shortIntroduction:
      "A comprehensive guide to building iOS applications using Swift.",
    rating: 4.7,
    categories: ["Mobile Development", "Programming Language"],
    instructors: ["Alice Johnson"],
    languages: "English",
    whatYouWillLearn: [
      "Swift programming language",
      "iOS app architecture",
      "Using Xcode and Interface Builder",
      "Publishing apps to the App Store",
    ],
    topics: ["Swift Basics", "UI Design", "App Deployment"],
    requirements: ["Basic programming knowledge", "Mac computer with Xcode"],
    description:
      "This course is ideal for developers who want to create iOS applications. You will learn Swift programming and how to use Apple's development tools.",
    whoIsThisCourseFor: [
      "Aspiring iOS developers",
      "Mobile developers looking to expand their skills",
    ],
    price: 59.99,
    currency: "$",
    thumbnail: "https://picsum.photos/1000/600?random=2",
    promoVideo: "https://youtu.be/nAchMctX4YA?si=TMW_llfSB98lJ-FN",
    enrolledStudents: 800,
    enroll: false,
  },
];
