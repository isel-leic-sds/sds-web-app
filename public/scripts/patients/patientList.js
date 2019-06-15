$(document).ready(function () {
    $('.ui.dark-color.header').hover(
        function () {
            if (!$(this).hasClass('selected')) {
                $(this).attr('class', 'ui light-color active header')
            }
        },
        function () {
            if (!$(this).hasClass('selected')) {
                $(this).attr('class', 'ui dark-color header')
            }
        }
    )

    $('.ui.dark-color.header').click(function () {
        $('[id|="patient"]').each(function (i, el) {
            $(el).attr('class', 'ui dark-color header')
        });
        $(this).attr('class', 'ui light-color active selected header')
    })
})