# Generated by Django 4.2.2 on 2023-07-19 13:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('application', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='application',
            name='last_login_date',
        ),
    ]
