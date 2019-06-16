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
        const item = $(this)
        const dark_header ='ui dark-color header'
        const light_active_header = 'ui light-color active selected header'
        const divider = $('#patient_info_divider')
        if (!$(this).hasClass('selected')) {
            $('[id|="patient"]').each(function (i, el) {
                $(el).attr('class', dark_header)
            });
            const label = item.children('.content').text()
            const id = parseSdsID(label)
            item.attr('class', light_active_header)
            $.ajax({
                method: 'POST',
                url: 'https://sds-web-app.herokuapp.com/sds/api/v1/patient/info',
                // url: 'http://localhost:3000/sds/api/v1/patient/info',
                data: { sdsID: id }
            }).done(function (data) {
                if (data) {
                    $('#patient_info').html(
                        '<div class="ui segment">' +
                            '<h2 style="display: inline; color:#005461;">' +
                                `<i class="user icon"></i> ${parseName(label)}` +
                            '</h2>' +
                            '<div class="ui segment">' +
                                '<div class="field">' +
                                    `<i class="id badge icon"></i> NIF: ${data.nif}` +
                                '</div>' +
                                '<div class="field">' +
                                    '<i class="calendar alternate outline icon"></i>' + `Data de Nascimento: ${data.dateOfBirth}` +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        displaySecundaryContact(data.contact)
                    )
                    divider.removeClass('hidden')
                    divider.html('<i class="eye icon" style="margin-right: 0px;"></i>')
                }
            })
        } else {
            item.attr('class', dark_header)
            $('#patient_info').html('')
            divider.addClass('hidden')
            divider.html('')
        }
    })
})

function parseSdsID(value) {
    const regex = /\((.*?)\)/g
    return regex.exec(value)[1]
}

function parseName(value) {
    return value.trim().split('\n')[0]
}

function displaySecundaryContact(contact) {
    if (contact) {
        return '<div class="ui segment">' +
            '<h2 style="display: inline; color:#005461;">' +
                '<i class="address card outline icon"></i>' + 'Contacto S.O.S.' +
            '</h2>' +
            '<div class="ui segment">' +
                '<div class="field">' +
                    '<i class="user icon"></i>' + `Nome: ${contact.name}` +
                '</div>' +
                '<div class="field">' +
                    '<i class="phone icon"></i>' + `Contacto: ${contact.phoneNumber}` +
                '</div>' +
            '</div>' +
        '</div>'
    } else {
        return ''
    }
}

$('#patient_ID-data').focusout(function () {
    const input = $(this)
    const value = input.val()
    const field = $('#patient_ID-field')
    if (value.length >= 5) {
        $.ajax({
            method: 'POST',
            url: 'https://sds-web-app.herokuapp.com/sds/api/v1/patient/validate',
            // url: 'http://localhost:3000/sds/api/v1/patient/validate',
            data: { sdsID: value }
        }).done(function (data) {
            if (data) {
                field.addClass('error')
                $('#create-patient-btn').prop('disabled', true)
                const errorMessage = $('.ui.error.message')
                errorMessage.html(
                    '<ul class="list">' +
                    '<li>SDS_ID: Este identificador já existe</li>' +
                    '</ul>'
                )
                errorMessage.show()
            } else {
                field.removeClass('error')
                $('#create-patient-btn').prop('disabled', false)
                const errorMessage = $('.ui.error.message')
                errorMessage.html('')
                errorMessage.hide()
            }
        });
    } else {
        field.removeClass('error')
        $('#create-patient-btn').prop('disabled', false)
        const errorMessage = $('.ui.error.message')
        errorMessage.html('')
        errorMessage.hide()
    }
})