const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const roadmapData = [
    {
      title: "frontend",
      content: `[{"name":"Frontend","children":[{"name":"HTML","children":[{"name":"Introduction to HTML","moduleDescription":"Basics of HTML, tags, and elements"},{"name":"HTML5 Features","moduleDescription":"New features and elements in HTML5"},{"name":"Semantic HTML","moduleDescription":"Understanding the importance of semantic HTML"},{"name":"HTML Forms","moduleDescription":"Creating forms and form validations in HTML","link":"https://en.wikipedia.org/wiki/HTML_forms"}]},{"name":"CSS","children":[{"name":"Introduction to CSS","moduleDescription":"Basics of CSS, selectors, and properties"},{"name":"CSS Box Model","moduleDescription":"Understanding padding, margin, and borders"},{"name":"Responsive Design","moduleDescription":"Creating mobile-friendly layouts with CSS"},{"name":"CSS Grid and Flexbox","moduleDescription":"Advanced layout techniques","link":"https://en.wikipedia.org/wiki/CSS_Grid_Layout"}]},{"name":"JavaScript","children":[{"name":"JavaScript Basics","moduleDescription":"Variables, data types, and control structures in JavaScript"},{"name":"DOM Manipulation","moduleDescription":"Interacting with HTML using JavaScript"},{"name":"ES6 Features","moduleDescription":"Arrow functions, classes, and modules in ES6"},{"name":"Asynchronous JavaScript","moduleDescription":"Promises, async/await, and fetching data from APIs","link":"https://en.wikipedia.org/wiki/JavaScript"}]},{"name":"Frontend Frameworks","children":[{"name":"Introduction to React","moduleDescription":"Building user interfaces with React library"},{"name":"Vue.js Essentials","moduleDescription":"Understanding components and reactivity in Vue.js"},{"name":"State Management with Redux","moduleDescription":"Managing state in complex applications with Redux"},{"name":"Component Styling in Angular","moduleDescription":"Styling components using Angular's features","link":"https://en.wikipedia.org/wiki/React_(web_framework)"}]}]}]`,
      userId: "clu46y7ux000011yb6hogdtdo",
    },
  ];
  const res = await prisma.roadmap.createMany({
    data: roadmapData,
  });
  console.log(res);
}

main()
  .then(() => console.log("✅ Successfully finished seeding"))
  .catch((err) => {
    console.log("Error while seeding the database: ", err);
  })
  .finally(() => prisma.$disconnect());
