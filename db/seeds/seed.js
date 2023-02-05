/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('materials').del()
  await knex('materials').insert([
    { category: "ppc", title: "mat title", description: "some information about that material"},
    { category: "ppc", title: "mat title", description: "some information about that material"},
    { category: "ppc", title: "mat title", description: "some information about that material"},
    { category: "ppc", title: "mat title", description: "some information about that material"},
    { category: "web", title: "mat title", description: "some information about that material"},
    { category: "web", title: "mat title", description: "some information about that material"},
    { category: "web", title: "mat title", description: "some information about that material"},
    { category: "web", title: "mat title", description: "some information about that material"},
    { category: "osint", title: "mat title", description: "some information about that material"},
    { category: "osint", title: "mat title", description: "some information about that material"},
    { category: "osint", title: "mat title", description: "some information about that material"},
    { category: "osint", title: "mat title", description: "some information about that material"}
  ]);

  await knex('tasks').del()
  await knex('tasks').insert([
    { category: "ppc", title: "task title", difficulty: "normal", points: 50, task_file: "pathToFile", answer: "ans", solution_file: "pathToFile", description: "some information about that task"},
    { category: "ppc", title: "task title", difficulty: "normal", points: 50, task_file: "pathToFile", answer: "ans", solution_file: "pathToFile", description: "some information about that task"},
    { category: "ppc", title: "task title", difficulty: "normal", points: 50, task_file: "pathToFile", answer: "ans", solution_file: "pathToFile", description: "some information about that task"},
    { category: "ppc", title: "task title", difficulty: "normal", points: 50, task_file: "pathToFile", answer: "ans", solution_file: "pathToFile", description: "some information about that task"},
    { category: "web", title: "task title", difficulty: "normal", points: 50, task_file: "pathToFile", answer: "ans", solution_file: "pathToFile", description: "some information about that task"},
    { category: "web", title: "task title", difficulty: "normal", points: 50, task_file: "pathToFile", answer: "ans", solution_file: "pathToFile", description: "some information about that task"},
    { category: "web", title: "task title", difficulty: "normal", points: 50, task_file: "pathToFile", answer: "ans", solution_file: "pathToFile", description: "some information about that task"},
    { category: "web", title: "task title", difficulty: "normal", points: 50, task_file: "pathToFile", answer: "ans", solution_file: "pathToFile", description: "some information about that task"},
    { category: "osint", title: "task title", difficulty: "normal", points: 50, task_file: "pathToFile", answer: "ans", solution_file: "pathToFile", description: "some information about that task"},
    { category: "osint", title: "task title", difficulty: "normal", points: 50, task_file: "pathToFile", answer: "ans", solution_file: "pathToFile", description: "some information about that task"},
    { category: "osint", title: "task title", difficulty: "normal", points: 50, task_file: "pathToFile", answer: "ans", solution_file: "pathToFile", description: "some information about that task"},
    { category: "osint", title: "task title", difficulty: "normal", points: 50, task_file: "pathToFile", answer: "ans", solution_file: "pathToFile", description: "some information about that task"}
  ]);
};
