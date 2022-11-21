function addPost(post){
    $('#browse-posts').append(`
        <div class="post">
            <div class="post-header">
                <p class="post-author" style="display: inline"> ${post.author} </p>
                <p class="post-date" style="display: inline"> ${post.date} </p>
            </div>
            <div class="post-content">
                ${post.message}
            </div>
        </div>`
    );
}

function postsUpdater(){
    fetch('/dump?from=' + $('.post-date:last').text())
    .then((r) => r.json())
    .then((posts) => {
        for (post of posts){
            addPost(post);
        }
    });
}

let postsIntervalId;
$('#send-btn').click((event) => {
    if (postsIntervalId !== undefined){
        clearInterval(postsIntervalId);
        postsIntervalId = undefined;
    }
    $('#send-message').show();
    $('#browse-posts').hide();
});

$('#browse-btn').click((event) => {
    if (postsIntervalId === undefined){
        postsUpdater();
        postsIntervalId = setInterval(postsUpdater, 3000);
    }
    $('#browse-posts').show();
    $('#send-message').hide();
});
