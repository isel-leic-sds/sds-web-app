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
                method: 'GET',
                url:    `/sds/api/v1/patient/${id}`
            }).done(function (patient) {
                if (patient) {
                    $('#patient_info').html(
                        '<div class="ui segment">' +
                            '<h2 style="display: inline; color:#005461;">' +
                                `<i class="user icon"></i> ${patient.name}` +
                            '</h2>' +
                            '<div class="ui segment">' +
                                '<div class="field">' +
                                    `<i class="id badge icon"></i> NIF: ${patient.info.nif}` +
                                '</div>' +
                                '<div class="field">' +
                                    '<i class="calendar alternate outline icon"></i>' + `Data de Nascimento: ${patient.info.dateOfBirth}` +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        displaySecundaryContact(patient.info.contact)
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