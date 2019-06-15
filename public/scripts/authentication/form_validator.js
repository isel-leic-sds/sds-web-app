// Sign-in form validator
$(document).ready(function () {
    $('.ui.large.form.sign-in').form({
        fields: {
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
            }
        }
    })
})

// Sign-up form validator
$(document).ready(function () {
    $('.ui.large.form.sign-up').form({
        fields: {
            name: {
                identifier: 'name',
                rules: [
                    {
                        type: 'empty',
                        prompt: 'Nome: Introduza um nome'
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
            }
        }
    })
})