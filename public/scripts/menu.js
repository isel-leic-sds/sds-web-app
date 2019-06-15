// Menu UI CSS and JS
$(document).ready(function () {
    $('.ui.light-color.text.button.item').hover(
        function () {
            if (!$(this).hasClass('selected')) {
                $(this).attr('class', 'ui dark-color text button active item')
                $('.light-color.sign.in.alternate.icon').attr('class', 'dark-color sign in alternate icon')
            }

        },
        function () {
            if (!$(this).hasClass('selected')) {
                $(this).attr('class', 'ui light-color text button item')
                $('.dark-color.sign.in.alternate.icon').attr('class', 'light-color sign in alternate icon')
            }
        }
    )

    $('.ui.dark-color.item').hover(
        function () {
            if (!$(this).hasClass('selected')) {
                $(this).attr('class', 'ui light-color active item')
            }
        },
        function () {
            if (!$(this).hasClass('selected')) {
                $(this).attr('class', 'ui dark-color item')
            }
        }
    )
})