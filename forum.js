const postBtn = document.getElementById("postBtn")
const username = document.getElementById("username")
const commentText = document.getElementById("commentText")
const commentsDiv = document.getElementById("comments")


let comments = JSON.parse(localStorage.getItem("forumComments")) || []


function displayComments() {

    commentsDiv.innerHTML = ""

    comments.forEach(comment => {

        let div = document.createElement("div")

        div.classList.add("comment")

        div.innerHTML = `

<div class="comment-name">${comment.name}</div>
<div class="comment-text">${comment.text}</div>

`

        commentsDiv.appendChild(div)

    })

}

displayComments()


postBtn.addEventListener("click", () => {

    let name = username.value.trim()

    let text = commentText.value.trim()

    if (name == "" || text == "") return


    let newComment = {

        name: name,
        text: text

    }

    comments.push(newComment)

    localStorage.setItem("forumComments", JSON.stringify(comments))


    username.value = ""
    commentText.value = ""

    displayComments()

})