
function sendMessage(){
    let message = $('#message');
    if (message.val() === ""){
        message.css({ border: '1px solid red' });
        message.attr('placeholder', 'Type something!');
        return;
    }

    let author = $('#author');
    //API request!
    fetch('/send', {
        method: 'post',
        body: new URLSearchParams({'message' : message.val(), 'author' : author.val()})

    }).then((response) => {
        //reset frontend
        message.val('');
        author.val('');

    }).catch(error => console.log(error));
}
