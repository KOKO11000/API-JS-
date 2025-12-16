// async function getPosts() {
//     try {
//         const response = await fetch("https://jsonplaceholder.typicode.com/posts")
//         const data = await response.json()
//         let obj = {
//             userId : count
//         }
        
//         data.forEach(user => {
//             if (user.userId in obj) {
//                 count ++
//             } else {
//                 count = 0
//             }
//         });
//     } catch (error) {
//         console.log(error);
        
//     }
// }
// getPosts()

async function exercise1() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const posts = await response.json();

  const counts = {};

  for (let i = 0; i < posts.length; i++) {
    const userId = posts[i].userId;

    if (counts[userId]) {
      counts[userId]++;
    } else {
      counts[userId] = 1;
    }
  }

  console.log("Exercise 1 – posts per user:");
  console.log(counts);
}



async function exercise2(userId) {
  const userRes = await fetch("https://jsonplaceholder.typicode.com/users/" + userId);
  const user = await userRes.json();

  const postsRes = await fetch("https://jsonplaceholder.typicode.com/posts?userId=" + userId);
  const posts = await postsRes.json();

  const todosRes = await fetch("https://jsonplaceholder.typicode.com/todos?userId=" + userId);
  const todos = await todosRes.json();

  let completed = 0;
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].completed === true) {
      completed++;
    }
  }

  const percent = (completed / todos.length) * 100;

  console.log("Exercise 2 – user profile");
  console.log("Name:", user.name);
  console.log("Email:", user.email);
  console.log("Posts:", posts.length);
  console.log("Todos:", todos.length);
  console.log("Completed:", percent.toFixed(1) + "%");
}



async function exercise3(keyword) {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  const posts = await res.json();

  console.log("Exercise 3 – posts with keyword:", keyword);

  for (let i = 0; i < posts.length; i++) {
    if (
      posts[i].title.includes(keyword) ||
      posts[i].body.includes(keyword)
    ) {
      const comRes = await fetch(
        "https://jsonplaceholder.typicode.com/comments?postId=" + posts[i].id
      );
      const comments = await comRes.json();

      console.log(
        posts[i].title,
        "- comments:",
        comments.length
      );
    }
  }
}


async function exercise4() {
  const usersRes = await fetch("https://jsonplaceholder.typicode.com/users");
  const users = await usersRes.json();

  console.log("Exercise 4 – suspicious users");

  for (let i = 0; i < users.length; i++) {
    const todosRes = await fetch(
      "https://jsonplaceholder.typicode.com/todos?userId=" + users[i].id
    );
    const todos = await todosRes.json();

    let completed = 0;
    for (let j = 0; j < todos.length; j++) {
      if (todos[j].completed === true) {
        completed++;
      }
    }

    const percent = (completed / todos.length) * 100;

    if (todos.length > 10 && percent < 30) {
      console.log(
        users[i].name,
        users[i].email,
        percent.toFixed(1) + "%"
      );
    }
  }
}



async function exercise5(userA, userB) {
  async function score(userId) {
    const postsRes = await fetch(
      "https://jsonplaceholder.typicode.com/posts?userId=" + userId
    );
    const posts = await postsRes.json();

    const todosRes = await fetch(
      "https://jsonplaceholder.typicode.com/todos?userId=" + userId
    );
    const todos = await todosRes.json();

    let commentsCount = 0;

    for (let i = 0; i < posts.length; i++) {
      const comRes = await fetch(
        "https://jsonplaceholder.typicode.com/comments?postId=" + posts[i].id
      );
      const comments = await comRes.json();
      commentsCount += comments.length;
    }

    return posts.length * 2 + todos.length + commentsCount * 0.5;
  }

  const scoreA = await score(userA);
  const scoreB = await score(userB);

  console.log("Exercise 5 – comparison");
  console.log("User", userA, "score:", scoreA);
  console.log("User", userB, "score:", scoreB);

  if (scoreA > scoreB) {
    console.log("User", userA, "is busier");
  } else {
    console.log("User", userB, "is busier");
  }
}

async function main() {
  await exercise1();
  await exercise2(1);
  await exercise3("qui");
  await exercise4();
  await exercise5(1, 2);
}

main();
