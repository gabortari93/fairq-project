# Generated by Django 4.2.2 on 2023-07-20 17:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('identity_verification', '0005_remove_identityverification_application_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='identityverification',
            name='verified_by',
        ),
    ]
