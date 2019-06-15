// Patient form validator
$(document).ready(function () {
    $('.ui.form.patient').form({
        fields: {
            name: {
                identifier: 'name',
                rules: [
                    {
                        type: 'empty',
                        prompt: 'Nome: Introduza o nome do paciente'
                    }
                ]
            },
            sdsID: {
                identifier: 'sdsID',
                rules: [
                    {
                        type: 'empty',
                        prompt: 'SDS_ID: Introduza um identificador'
                    },
                    {
                        type: 'minLength[5]',
                        prompt: 'SDS_ID: Mínimo de 5 caracteres'
                    }
                ]
            },
            password: {
                identifier: 'password',
                rules: [
                    {
                        type: 'empty',
                        prompt: 'Palavra-passe: Introduza uma palavra-passe'
                    },
                    {
                        type: 'minLength[4]',
                        prompt: 'Palavra-passe: Mínimo de 4 caracteres'
                    }
                ]
            },
            nif: {
                identifier: 'nif',
                rules: [
                    {
                        type: 'empty',
                        prompt: 'NIF: Introduza o NIF do paciente'
                    }
                ]
            }
        }
    })

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
})
