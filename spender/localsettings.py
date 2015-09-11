ADMINS = (('AJ', 'ajatamayo@gmail.com'),)

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'spender',
        'USER': 'django_login',
        'PASSWORD': 'password',
    }
}

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

INTERNAL_IPS = ('192.168.56.1',)
