// Sign-in modal
$(document).ready(function () {
    $('#sign-in-btn').click(function () {
        $('.sign-in-modal').modal('show')
    })
    $('.sign-in-modal').modal({
        closable: true
    })
})

// Sign-up modal
$(document).ready(function () {
    $('#sign-up-btn').click(function () {
        $('.sign-up-modal').modal('show');
    })
    $('.sign-up-modal').modal({
        closable: true
    })
})