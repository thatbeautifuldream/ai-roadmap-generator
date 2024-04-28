

const data = {
  "Introduction to Node.js": [
    "What is Node.js?",
    "Advantages of Node.js",
    "Setting up Node.js environment",
  ],
  "Node.js Basics": [
    "Working with npm (Node Package Manager)",
    "Basic modules and their usage",
    "Asynchronous programming with callbacks",
  ],
  "Node.js Advanced Concepts": [
    "Event loop and event emitters",
    "Streams and buffers",
    "Error handling and debugging",
  ],
  "Node.js Frameworks": [
    "Express.js framework",
    "Sails.js framework",
    "Koa.js framework",
  ],
  "Database Integration with Node.js": [
    "Connecting to databases",
    "CRUD operations with databases",
    "ORM (Object-Relational Mapping) libraries",
  ],
  "Testing and Debugging in Node.js": [
    "Unit testing with Mocha and Chai",
    "Debugging with Node.js inspector",
    "Performance optimization",
  ],
  "Building RESTful APIs with Node.js": [
    "Understanding REST architecture",
    "Express.js routing for APIs",
    "Authentication and security",
  ],
  "Real-time Applications with Node.js": [
    "Socket.io for real-time communication",
    "Building chat applications",
    "Scalability and load balancing",
  ],
  "Deployment and DevOps for Node.js": [
    "Deploying Node.js applications",
    "Containerization with Docker",
    "DevOps best practices",
  ],
};

 const tree = [
  {
    name: 'Node.js',
  children: Object.keys(data).map(sectionName => ({
    name: sectionName,
    children: data[sectionName].map(topic => ({
      name: topic
    }))
  }))
  }
];

export default tree