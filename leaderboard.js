const leaderboard = document.getElementById("leaderboard");

/* GET SCORES FROM LOCAL STORAGE */

let scores = JSON.parse(localStorage.getItem("flappyScores")) || [];

/* REMOVE DUPLICATES AND KEEP HIGHEST SCORE */

let uniquePlayers = {};

scores.forEach(player => {

    let name = player.name.toLowerCase();  // avoid case issue

    if (!uniquePlayers[name] || player.score > uniquePlayers[name].score) {

        uniquePlayers[name] = player;

    }

});

/* CONVERT OBJECT BACK TO ARRAY */

scores = Object.values(uniquePlayers);

/* SORT HIGH TO LOW */

scores.sort((a, b) => b.score - a.score);

/* KEEP TOP 10 PLAYERS ONLY */

scores = scores.slice(0, 10);

/* SAVE CLEAN DATA BACK */

localStorage.setItem("flappyScores", JSON.stringify(scores));

/* DISPLAY PLAYERS */

scores.forEach((player, index) => {

    let div = document.createElement("div");

    /* RANK COLORS */

    if (index === 0) {

        div.classList.add("player", "rank1");

    }

    else if (index === 1) {

        div.classList.add("player", "rank2");

    }

    else if (index === 2) {

        div.classList.add("player", "rank3");

    }

    else {

        div.classList.add("player", "rankNormal");

    }

    /* PLAYER DATA */

    div.innerHTML = `
<span>${player.name}</span>
<span>${player.score}</span>
<span>#${index + 1}</span>
`;

    leaderboard.appendChild(div);

});